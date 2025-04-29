import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Whisper language code to our language code mapping
const WHISPER_LANGUAGE_MAP: Record<string, string> = {
  arabic: 'ar',
  ar: 'ar',
  chinese: 'zh',
  mandarin: 'zh',
  cmn: 'zh',
  zh: 'zh',
  english: 'en',
  en: 'en',
  french: 'fr',
  fr: 'fr',
  german: 'de',
  de: 'de',
  japanese: 'ja',
  ja: 'ja',
  korean: 'ko',
  ko: 'ko',
  spanish: 'es',
  es: 'es',
  urdu: 'ur',
  ur: 'ur',
};

async function trimAudioBlob(blob: Blob, maxDurationMs: number = 10000): Promise<Blob> {
  // Create an audio context
  const audioContext = new (globalThis.AudioContext || (globalThis as any).webkitAudioContext)();
  
  // Convert blob to array buffer
  const arrayBuffer = await blob.arrayBuffer();
  
  // Decode the audio data
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Calculate how many samples we need for our desired duration
  const sampleRate = audioBuffer.sampleRate;
  const numberOfSamples = Math.min(
    audioBuffer.length,
    Math.floor((maxDurationMs / 1000) * sampleRate)
  );
  
  // Create a new buffer for the trimmed audio
  const trimmedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    numberOfSamples,
    sampleRate
  );
  
  // Copy the samples we want to keep
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    const trimmedData = trimmedBuffer.getChannelData(channel);
    trimmedData.set(channelData.subarray(0, numberOfSamples));
  }
  
  // Convert back to blob
  const trimmedArrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
    const offlineContext = new OfflineAudioContext(
      trimmedBuffer.numberOfChannels,
      trimmedBuffer.length,
      trimmedBuffer.sampleRate
    );
    const source = offlineContext.createBufferSource();
    source.buffer = trimmedBuffer;
    source.connect(offlineContext.destination);
    source.start();
    offlineContext.startRendering().then((renderedBuffer) => {
      const wav = audioBufferToWav(renderedBuffer);
      resolve(wav);
    });
  });
  
  return new Blob([trimmedArrayBuffer], { type: 'audio/wav' });
}

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const arrayBuffer = new ArrayBuffer(totalSize);
  const dataView = new DataView(arrayBuffer);

  // Write WAV header
  writeString(dataView, 0, 'RIFF');
  dataView.setUint32(4, totalSize - 8, true);
  writeString(dataView, 8, 'WAVE');
  writeString(dataView, 12, 'fmt ');
  dataView.setUint32(16, 16, true);
  dataView.setUint16(20, format, true);
  dataView.setUint16(22, numChannels, true);
  dataView.setUint32(24, sampleRate, true);
  dataView.setUint32(28, byteRate, true);
  dataView.setUint16(32, blockAlign, true);
  dataView.setUint16(34, bitDepth, true);
  writeString(dataView, 36, 'data');
  dataView.setUint32(40, dataSize, true);

  // Write audio data
  const offset = 44;
  const length = buffer.length;
  for (let i = 0; i < numChannels; i++) {
    const channel = buffer.getChannelData(i);
    for (let j = 0; j < length; j++) {
      const index = offset + (j * numChannels + i) * bytesPerSample;
      const sample = Math.max(-1, Math.min(1, channel[j]));
      dataView.setInt16(index, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
  }

  return arrayBuffer;
}

function writeString(dataView: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    dataView.setUint8(offset + i, string.charCodeAt(i));
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;

    if (!audioBlob) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

    // Use Whisper's transcription with specific settings for language detection
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      prompt: "This is a language identification task. Please identify the language being spoken, regardless of the content.",
      temperature: 0.1, // Lower temperature for more deterministic results
    });

    // Get the detected language code from Whisper
    const detectedLanguage = response.language?.toLowerCase();
    
    if (!detectedLanguage) {
      return NextResponse.json(
        { error: 'Could not detect language' },
        { status: 400 }
      );
    }

    // Map the Whisper language code to our supported language code
    const mappedLanguage = WHISPER_LANGUAGE_MAP[detectedLanguage] || detectedLanguage;

    return NextResponse.json({
      language: mappedLanguage,
      originalLanguage: detectedLanguage,
    });
  } catch (error) {
    console.error('Error detecting language:', error);
    return NextResponse.json(
      { error: 'Failed to detect language' },
      { status: 500 }
    );
  }
} 