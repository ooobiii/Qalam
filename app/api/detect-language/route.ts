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