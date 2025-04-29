"use client";

import { useState } from "react";
import { TranscriptionSection } from "../components/transcription-section";
import { LanguageSelector, LANGUAGES } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { MicButton } from "@/components/mic-button";
import { SettingsPanel } from "@/components/settings-panel";
import Auth from "@/components/Auth";
import { useLanguagePreferences } from "./hooks/useLanguagePreferences";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  
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
            autoDetectEnabled={false}
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
            <MicButton 
              onRecordingChange={setIsRecording}
              onTranscriptChange={setTranscript}
              selectedLanguage={sourceLanguage}
            />
            <div></div>
          </div>
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
