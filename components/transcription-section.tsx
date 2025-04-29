"use client";

import { useEffect, useRef, useState } from "react";
import { Language } from "./language-selector";
import { detectLanguage, translateText } from "./translation-service";
import SaveTranscriptionButton from "./SaveTranscriptionButton";

interface TranscriptionSectionProps {
  transcript: string;
  isRecording: boolean;
  targetLanguage: Language;
  autoScrollEnabled: boolean;
}

export function TranscriptionSection({ transcript, isRecording, targetLanguage, autoScrollEnabled }: TranscriptionSectionProps) {
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [latestLine, setLatestLine] = useState("");
  const [visibleTranslation, setVisibleTranslation] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const translationRef = useRef<HTMLDivElement>(null);
  
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

  // Update transcription and latest line when transcript prop changes
  useEffect(() => {
    if (transcript) {
      setTranscription(transcript);
      // Get the last line of the transcript
      const lines = transcript.split('\n');
      setLatestLine(lines[lines.length - 1]);
    }
  }, [transcript]);

  // Translate text when transcription or target language changes
  useEffect(() => {
    const translateTranscription = async () => {
      if (!transcription) {
        setTranslation("");
        setVisibleTranslation("");
        return;
      }
      
      const requestId = Date.now();
      translationRequestRef.current = requestId;
      
      setIsTranslating(true);
      
      try {
        const sourceLang = detectLanguage(transcription);
        const result = await translateText(transcription, sourceLang, targetLanguage);
        
        if (translationRequestRef.current === requestId) {
          setTranslation(result);
          
          // When auto-scroll is enabled, show only the last few sentences
          if (autoScrollEnabled) {
            const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
            const lastSentences = sentences.slice(-3).join(' '); // Show last 3 sentences
            setVisibleTranslation(lastSentences);
          } else {
            setVisibleTranslation(result);
          }
        }
      } catch (error) {
        console.error("Translation error:", error);
        if (translationRequestRef.current === requestId) {
          setTranslation("");
          setVisibleTranslation("");
        }
      } finally {
        if (translationRequestRef.current === requestId) {
          setIsTranslating(false);
        }
      }
    };

    if (transcription) {
      const delayTimer = setTimeout(() => {
        translateTranscription();
      }, 300);
      
      return () => clearTimeout(delayTimer);
    } else {
      setTranslation("");
      setVisibleTranslation("");
    }
  }, [transcription, targetLanguage, autoScrollEnabled]);

  // Update visible translation when auto-scroll setting changes
  useEffect(() => {
    if (translation) {
      if (autoScrollEnabled) {
        const sentences = translation.match(/[^.!?]+[.!?]+/g) || [translation];
        const lastSentences = sentences.slice(-3).join(' '); // Show last 3 sentences
        setVisibleTranslation(lastSentences);
      } else {
        setVisibleTranslation(translation);
      }
    }
  }, [autoScrollEnabled, translation]);

  // Smooth scroll implementation for translation
  useEffect(() => {
    if (!autoScrollEnabled || !translationRef.current) return;

    const scrollToBottomSmooth = () => {
      const element = translationRef.current;
      if (!element) return;

      const scrollHeight = element.scrollHeight;
      const height = element.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      element.style.scrollBehavior = 'smooth';
      element.scrollTop = maxScrollTop;
    };

    scrollToBottomSmooth();
  }, [visibleTranslation, autoScrollEnabled]);

  return (
    <div className="panel-container">
      <div 
        ref={panelRef}
        className="panel"
      >
        <div className={`transcription-content ${autoScrollEnabled ? 'live-mode' : ''}`}>
          <h3 className="panel-label font-work-sans">
            Original
          </h3>
          <div className="original-text-container">
            {autoScrollEnabled ? (
              latestLine ? (
                <p className="original-text-line latest">
                  {latestLine}
                </p>
              ) : (
                <p className="panel-placeholder">
                  {isRecording ? "Listening..." : "Waiting for speech..."}
                </p>
              )
            ) : (
              transcription ? (
                transcription.split('\n').map((line, index) => (
                  <p key={index} className="original-text-line">
                    {line}
                  </p>
                ))
              ) : (
                <p className="panel-placeholder">
                  {isRecording ? "Listening..." : "Waiting for speech..."}
                </p>
              )
            )}
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="translation-content">
          <h3 className="panel-label font-work-sans">
            Translation <span className="language-flag">{targetLanguage.flag}</span> {targetLanguage.name}
          </h3>
          
          <div 
            ref={translationRef} 
            className={`translation-text-container ${autoScrollEnabled ? 'smooth-scroll' : ''}`}
          >
            {visibleTranslation ? (
              <p className="translation-text">
                {visibleTranslation}
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