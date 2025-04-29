"use client";

import { useState } from "react";
import { TranscriptionSection } from "../components/transcription-section";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { MicButton } from "@/components/mic-button";
import { SettingsPanel } from "@/components/settings-panel";
import Auth from "@/components/Auth";
import { useLanguagePreferences } from "./hooks/useLanguagePreferences";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";
import { LanguageDetector } from "@/components/language-detector";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'error' | 'success' | null }>({ text: '', type: null });
  
  const {
    sourceLanguage,
    targetLanguage,
    updateSourceLanguage,
    updateTargetLanguage,
    isLoading
  } = useLanguagePreferences();

  if (isLoading) {
    return <div>Loading...</div>; // You might want to create a proper loading component
  }

  const handleStatus = (status: { text: string; type: 'error' | 'success' | null }) => {
    setStatusMessage(status);
  };

  const handleRecordingChange = (isRecording: boolean) => {
    setIsRecording(isRecording);
    if (isRecording) {
      // Clear status message when recording starts
      setStatusMessage({ text: '', type: null });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-content">
          <h1 className="font-work-sans font-medium">Qalam</h1>
          <div className="header-actions">
            <Auth />
            <ThemeToggle />
            <SettingsPanel 
              autoScrollEnabled={autoScrollEnabled}
              onAutoScrollChange={setAutoScrollEnabled}
            />
          </div>
        </div>
      </header>
      
      <main className="app-main container">
        <div className="language-controls">
          <LanguageSelector
            type="source"
            label="Speech Language"
            selectedLanguage={sourceLanguage}
            onLanguageChange={updateSourceLanguage}
          />
          <LanguageSelector
            type="target"
            label="Translate To"
            selectedLanguage={targetLanguage}
            onLanguageChange={updateTargetLanguage}
          />
        </div>
        
        <div className="transcription-container">
          <div className="section-header">
            <div></div>
            <div className="button-container">
              <LanguageDetector
                onLanguageDetected={updateSourceLanguage}
                onStatus={handleStatus}
                disabled={isRecording}
              />
              <MicButton 
                onRecordingChange={handleRecordingChange}
                onTranscriptChange={setTranscript}
                selectedLanguage={sourceLanguage}
              />
            </div>
            <div></div>
          </div>
          
          {statusMessage.type && (
            <div className="flex justify-center items-center w-full mb-4">
              <div className={`px-4 py-2 rounded-md transition-all duration-300 ${
                statusMessage.type === 'error' 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-green-50 text-green-600'
              }`}>
                <p className="text-sm font-medium">{statusMessage.text}</p>
              </div>
            </div>
          )}
          
          <TranscriptionSection 
            transcript={transcript}
            isRecording={isRecording}
            targetLanguage={targetLanguage}
            autoScrollEnabled={autoScrollEnabled}
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container footer-content">
          <p>&copy; {new Date().getFullYear()} Qalam - Live Transcription & Translation</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">About</a>
            <BuyMeCoffee />
          </div>
        </div>
      </footer>
    </div>
  );
}
