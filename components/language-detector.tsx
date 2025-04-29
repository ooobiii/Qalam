"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Language, LANGUAGES } from "./language-selector";

interface LanguageDetectorProps {
  onLanguageDetected: (language: Language) => void;
  disabled?: boolean;
}

export function LanguageDetector({ onLanguageDetected, disabled = false }: LanguageDetectorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunks: Blob[] = [];

  const startRecording = async () => {
    try {
      setError(null);
      // Clear the chunks array at the start of each recording
      chunks.length = 0;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await detectLanguage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Automatically stop recording after 5 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 5000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone');
    }
  };

  const detectLanguage = async (audioBlob: Blob) => {
    try {
      setIsDetecting(true);
      setError(null);

      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/detect-language', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to detect language');
      }

      if (data.language) {
        // Find the language in our supported languages list
        const detectedLanguage = LANGUAGES.find(lang => lang.code === data.language);
        if (detectedLanguage) {
          onLanguageDetected(detectedLanguage);
        } else {
          setError('Language not supported');
        }
      } else {
        setError('Could not detect language');
      }
    } catch (err) {
      console.error('Error detecting language:', err);
      setError(err instanceof Error ? err.message : 'Failed to detect language');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="language-detector">
      <button
        onClick={startRecording}
        disabled={disabled || isRecording || isDetecting}
        className={`button button-secondary flex items-center gap-2 ${isRecording ? 'animate-pulse' : ''}`}
        title="Record a sample to detect the language"
      >
        <Languages className="w-4 h-4" />
        <span>
          {isRecording ? 'Recording...' : 
           isDetecting ? 'Detecting...' : 
           'Detect Language'}
        </span>
      </button>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
} 