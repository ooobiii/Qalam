"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";

export function SettingsPanel() {
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
                    <input type="checkbox" defaultChecked />
                  </label>
                  <label className="settings-option">
                    <span>Show interim results</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Translation</h3>
                <div className="settings-options">
                  <label className="settings-option-row">
                    <span>Translation quality</span>
                    <select className="settings-select">
                      <option value="standard">Standard</option>
                      <option value="enhanced">Enhanced</option>
                      <option value="premium">Premium</option>
                    </select>
                  </label>
                  <label className="settings-option">
                    <span>Auto translate</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Appearance</h3>
                <div className="settings-options">
                  <label className="settings-option-row">
                    <span>Font size</span>
                    <select className="settings-select">
                      <option value="small">Small</option>
                      <option value="medium" selected>Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                  <label className="settings-option-row">
                    <span>Font family</span>
                    <select className="settings-select">
                      <option value="system" selected>System Default</option>
                      <option value="serif">Serif</option>
                      <option value="mono">Monospace</option>
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