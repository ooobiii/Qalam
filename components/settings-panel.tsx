"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";

interface SettingsPanelProps {
  onAutoScrollChange: (enabled: boolean) => void;
  autoScrollEnabled: boolean;
}

export function SettingsPanel({ onAutoScrollChange, autoScrollEnabled }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="theme-toggle"
        aria-label="Settings"
      >
        <Settings className="theme-icon" />
      </button>

      {isOpen && (
        <div className="modal-backdrop">
          <div className="settings-panel animate-in slide-in-from-right">
            <div className="settings-header">
              <h2>Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="theme-toggle"
                aria-label="Close settings"
              >
                <X className="theme-icon" />
              </button>
            </div>

            <div className="settings-content">
              <div className="settings-section">
                <h3>Transcription</h3>
                <div className="settings-options">
                  <label className="settings-option">
                    <span>Auto scroll</span>
                    <input 
                      type="checkbox" 
                      checked={autoScrollEnabled}
                      onChange={(e) => onAutoScrollChange(e.target.checked)}
                    />
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Appearance</h3>
                <div className="settings-options">
                  <label className="settings-option-row">
                    <span>Font size</span>
                    <select className="settings-select" defaultValue="medium">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 