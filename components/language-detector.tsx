"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Language, LANGUAGES } from "./language-selector";

interface LanguageDetectorProps {
  onLanguageDetected: (language: Language) => void;
  onStatus?: (message: { text: string; type: 'error' | 'success' | null }) => void;
  disabled?: boolean;
}

export function LanguageDetector({ onLanguageDetected, onStatus, disabled = false }: LanguageDetectorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const chunks: Blob[] = [];

  const startRecording = async () => {
    try {
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
      setIsRecording(true);

      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 5000);
    } catch (err) {
      console.error('Error starting recording:', err);
      onStatus?.({ text: 'Could not access microphone', type: 'error' });
    }
  };

  const detectLanguage = async (audioBlob: Blob) => {
    try {
      setIsDetecting(true);

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
        const detectedLanguage = LANGUAGES.find(lang => lang.code === data.language);
        if (detectedLanguage) {
          onLanguageDetected(detectedLanguage);
          onStatus?.({ 
            text: `Detected language: ${detectedLanguage.flag} ${detectedLanguage.name}`, 
            type: 'success' 
          });
        } else {
          onStatus?.({ text: 'Language not supported', type: 'error' });
        }
      } else {
        onStatus?.({ text: 'Could not detect language', type: 'error' });
      }
    } catch (err) {
      console.error('Error detecting language:', err);
      onStatus?.({ 
        text: err instanceof Error ? err.message : 'Failed to detect language', 
        type: 'error' 
      });
    } finally {
      setIsDetecting(false);
    }
  };

  return (
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
  );
} 