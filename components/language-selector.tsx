"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const LANGUAGES = [
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  // Temporarily disable auto detect
  // { code: "auto", name: "Auto Detect" }
];

export type Language = typeof LANGUAGES[0];

interface LanguageSelectorProps {
  type: 'source' | 'target';
  label: string;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  autoDetectEnabled?: boolean;
}

export function LanguageSelector({ 
  label,
  selectedLanguage, 
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter languages based on type - auto-detect temporarily disabled
  const availableLanguages = LANGUAGES;

  const handleSelectLanguage = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <div className="language-selector-label">{label}</div>
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

      {isOpen && (
        <div className="language-dropdown">
          <ul
            className="language-list"
            role="listbox"
            aria-labelledby="language-selector"
          >
            {availableLanguages.map((language) => (
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