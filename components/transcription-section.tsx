"use client";

import { useEffect, useRef, useState } from "react";
import { Language } from "./language-selector";
import { detectLanguage, translateText } from "./translation-service";
import SaveTranscriptionButton from "./SaveTranscriptionButton";

interface TranscriptionSectionProps {
  transcript: string;
  isRecording: boolean;
  targetLanguage: Language;
}

export function TranscriptionSection({ transcript, isRecording, targetLanguage }: TranscriptionSectionProps) {
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Keep track of translation request to avoid stale translations
  const translationRequestRef = useRef(0);

  // Check for saved transcription data on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('pendingTranscription');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Check if the data is recent (within the last hour)
        const timestamp = parsedData.timestamp || 0;
        const currentTime = new Date().getTime();
        const isRecent = (currentTime - timestamp) < (60 * 60 * 1000); // 1 hour
        
        if (isRecent) {
          console.log('Restoring saved transcription data');
          setTranscription(parsedData.transcription || '');
          setTranslation(parsedData.translation || '');
          // Optionally restore language settings if needed
          localStorage.removeItem('pendingTranscription');
        } else {
          // Data is too old, remove it
          localStorage.removeItem('pendingTranscription');
        }
      }
    } catch (error) {
      console.error('Error restoring transcription data:', error);
      localStorage.removeItem('pendingTranscription');
    }
  }, []);

  // Update transcription when transcript prop changes
  useEffect(() => {
    if (transcript) {
      setTranscription(transcript);
    }
  }, [transcript]);

  // Translate text when transcription or target language changes
  useEffect(() => {
    const translateTranscription = async () => {
      if (!transcription) {
        setTranslation("");
        return;
      }
      
      // Create a request ID to track this specific translation request
      const requestId = Date.now();
      translationRequestRef.current = requestId;
      
      setIsTranslating(true);
      console.log(`Starting translation to ${targetLanguage.name} (${targetLanguage.code})`);
      
      try {
        // Use the specific language selected by the user
        const sourceLang = detectLanguage(transcription);
        const result = await translateText(transcription, sourceLang, targetLanguage);
        
        console.log(`Translation completed: "${transcription.substring(0, 30)}..." → "${result.substring(0, 30)}..."`);
        
        // Only update if this is still the latest request
        if (translationRequestRef.current === requestId) {
          setTranslation(result);
        }
      } catch (error) {
        console.error("Translation error:", error);
        // Only update if this is still the latest request
        if (translationRequestRef.current === requestId) {
          setTranslation("");
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
          <h3 className="panel-label font-work-sans">
            Original
          </h3>
          <div className="original-text-container">
            {transcription ? (
              transcription.split('\n').map((line, index) => (
                <p key={index} className="original-text-line">
                  {line}
                </p>
              ))
            ) : (
              <p className="panel-placeholder">
                {isRecording ? "Listening..." : "Waiting for speech..."}
              </p>
            )}
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="translation-content">
          <h3 className="panel-label font-work-sans">
            Translation <span className="language-flag">{targetLanguage.flag}</span> {targetLanguage.name}
          </h3>
          
          <div className="translation-text-container">
            {translation ? (
              <p className="translation-text">
                {translation}
                {isTranslating && <span className="loading-indicator">...</span>}
              </p>
            ) : (
              <p className="panel-placeholder">
                {transcription ? "Translating..." : "Waiting for speech..."}
              </p>
            )}
          </div>
        </div>
        
        <SaveTranscriptionButton
          transcription={transcription}
          translation={translation}
          sourceLanguage={detectLanguage(transcription)}
          targetLanguage={targetLanguage.code}
          isRecording={isRecording}
        />
      </div>
    </div>
  );
} 