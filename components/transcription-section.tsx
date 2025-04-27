"use client";

import { useEffect, useRef, useState } from "react";
import { Language } from "./language-selector";
import { detectLanguage, translateText } from "./translation-service";

interface TranscriptionSectionProps {
  transcript: string;
  isRecording: boolean;
  targetLanguage: Language;
}

export function TranscriptionSection({ transcript, isRecording, targetLanguage }: TranscriptionSectionProps) {
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Keep track of translation request to avoid stale translations
  const translationRequestRef = useRef(0);

  // Update transcription when transcript prop changes
  useEffect(() => {
    setTranscription(transcript);
  }, [transcript]);

  // Translate text when transcription or target language changes
  useEffect(() => {
    const translateTranscription = async () => {
      if (!transcription) {
        setTranslation("");
        setTranslationError("");
        return;
      }
      
      // Create a request ID to track this specific translation request
      const requestId = Date.now();
      translationRequestRef.current = requestId;
      
      setIsTranslating(true);
      setTranslationError("");
      console.log(`Starting translation to ${targetLanguage.name} (${targetLanguage.code})`);
      
      try {
        // Use the specific language selected by the user
        const sourceLang = detectLanguage(transcription);
        const result = await translateText(transcription, sourceLang, targetLanguage);
        
        console.log(`Translation completed: "${transcription.substring(0, 30)}..." → "${result.substring(0, 30)}..."`);
        
        // Only update if this is still the latest request
        if (translationRequestRef.current === requestId) {
          setTranslation(result);
          setTranslationError("");
        }
      } catch (error) {
        console.error("Translation error:", error);
        // Only update if this is still the latest request
        if (translationRequestRef.current === requestId) {
          setTranslation("");
          setTranslationError("Translation failed. Please try again.");
        }
      } finally {
        // Only update if this is still the latest request
        if (translationRequestRef.current === requestId) {
          setIsTranslating(false);
        }
      }
    };

    if (transcription) {
      // Add a small delay to avoid too many rapid translations during typing/speaking
      const delayTimer = setTimeout(() => {
        translateTranscription();
      }, 300);
      
      return () => clearTimeout(delayTimer);
    } else {
      setTranslation("");
      setTranslationError("");
    }
  }, [transcription, targetLanguage]);

  // Auto-scroll to bottom as text is added
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [transcription, translation]);

  return (
    <div className="panel-container">
      <div 
        ref={panelRef}
        className="panel"
      >
        <div className="transcription-content">
          <h3 className="panel-label">
            Original
          </h3>
          <p className="panel-text">
            {transcription || (
              <span className="panel-placeholder">
                {isRecording ? "Listening..." : "Waiting for speech..."}
              </span>
            )}
            {transcription && !translation && <span className="animate-pulse">|</span>}
          </p>
        </div>
        
        <div className="divider"></div>
        
        <div className="translation-content">
          <h3 className="panel-label">
            Translation <span className="language-flag">{targetLanguage.flag}</span> {targetLanguage.name}
          </h3>
          
          {isTranslating && (
            <div className="loading-dots">
              <div className="loading-dot animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="loading-dot animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="loading-dot animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          
          {translationError && (
            <div className="error-message">
              {translationError}
            </div>
          )}
          
          <p className="panel-text">
            {!isTranslating && !translationError && (translation || (
              <span className="panel-placeholder">
                {transcription ? "Translating..." : "Waiting for speech..."}
              </span>
            ))}
            {translation && !isTranslating && <span className="animate-pulse">|</span>}
          </p>
        </div>
      </div>
    </div>
  );
} 