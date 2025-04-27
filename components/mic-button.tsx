"use client";

import { useState, useCallback, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Language } from "./language-selector";

interface MicButtonProps {
  onRecordingChange?: (isRecording: boolean) => void;
  onTranscriptChange?: (transcript: string) => void;
  selectedLanguage: Language;
}

export function MicButton({ 
  onRecordingChange, 
  onTranscriptChange,
  selectedLanguage 
}: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Update parent component with transcript changes
  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  // Keep local state in sync with SpeechRecognition state
  useEffect(() => {
    setIsRecording(listening);
  }, [listening]);

  const toggleRecording = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      // Use selected language code
      SpeechRecognition.startListening({ 
        continuous: true, 
        language: selectedLanguage.code
      });
    }
    
    const newState = !isRecording;
    setIsRecording(newState);
    
    if (onRecordingChange) {
      onRecordingChange(newState);
    }
  }, [isRecording, listening, resetTranscript, onRecordingChange, selectedLanguage]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <button
        className="button button-secondary"
        disabled
        title="Browser doesn't support speech recognition"
      >
        <MicOff className="mic-icon" />
        <span>Not Supported</span>
      </button>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <button
        className="button button-secondary"
        disabled
        title="Microphone access denied"
      >
        <MicOff className="mic-icon" />
        <span>No Microphone</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleRecording}
      className={`button ${isRecording ? "button-destructive" : "button-primary"}`}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? (
        <>
          <MicOff className="mic-icon" />
          <span>Stop Recording</span>
        </>
      ) : (
        <>
          <Mic className="mic-icon" />
          <span>Start Recording {selectedLanguage.flag} {selectedLanguage.name}</span>
        </>
      )}
    </button>
  );
} 