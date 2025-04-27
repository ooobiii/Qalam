"use client";

import { useState } from "react";
import { TranscriptionSection } from "../components/transcription-section";
import { LanguageSelector, LANGUAGES, Language } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { MicButton } from "@/components/mic-button";
import { SettingsPanel } from "@/components/settings-panel";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  // Default to English for source language and target language
  const [sourceLanguage, setSourceLanguage] = useState<Language>(
    LANGUAGES.find(lang => lang.code === "en") || LANGUAGES[0]
  );
  const [targetLanguage, setTargetLanguage] = useState<Language>(
    LANGUAGES.find(lang => lang.code === "en") || LANGUAGES[0]
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-content">
          <h1>Qalam</h1>
          <div className="header-actions">
            <ThemeToggle />
            <SettingsPanel />
          </div>
        </div>
      </header>
      
      <main className="app-main container">
        <div className="language-controls">
          <LanguageSelector
            type="source"
            label="Speech Language"
            selectedLanguage={sourceLanguage}
            onLanguageChange={setSourceLanguage}
            autoDetectEnabled={false}
          />
          <LanguageSelector
            type="target"
            label="Translate To"
            selectedLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
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
          </div>
        </div>
      </footer>
    </div>
  );
}
