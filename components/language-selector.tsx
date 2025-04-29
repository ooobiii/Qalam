"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LanguageDetector } from "./language-detector";

export const LANGUAGES = [
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" }
];

export type Language = typeof LANGUAGES[0];

interface LanguageSelectorProps {
  type: 'source' | 'target';
  label: string;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ 
  type,
  label,
  selectedLanguage, 
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <div className="language-selector-label">{label}</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="language-selector-button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="language-flag">{selectedLanguage.flag}</span>
          <span>{selectedLanguage.name}</span>
          <ChevronDown className="dropdown-icon" />
        </button>
        {type === 'source' && (
          <LanguageDetector
            onLanguageDetected={onLanguageChange}
          />
        )}
      </div>

      {isOpen && (
        <div className="language-dropdown">
          <ul
            className="language-list"
            role="listbox"
            aria-labelledby="language-selector"
          >
            {LANGUAGES.map((language) => (
              <li
                key={language.code}
                onClick={() => handleSelectLanguage(language)}
                className={`language-option ${
                  selectedLanguage.code === language.code
                    ? "language-option-selected"
                    : ""
                }`}
                role="option"
                aria-selected={selectedLanguage.code === language.code}
              >
                <span className="language-flag">{language.flag}</span>
                {language.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 