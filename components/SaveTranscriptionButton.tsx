"use client";

import { useState } from 'react';
import { Save, LogIn } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '../app/lib/supabase';

type SaveTranscriptionButtonProps = {
  transcription: string;
  translation: string;
  sourceLanguage: string;
  targetLanguage: string;
  isRecording: boolean;
};

export default function SaveTranscriptionButton({
  transcription,
  translation,
  sourceLanguage,
  targetLanguage,
  isRecording,
}: SaveTranscriptionButtonProps) {
  const { user } = useAuth();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Don't show anything if there's no content or currently recording
  if (!transcription || isRecording) {
    return null;
  }

  const handleSave = async () => {
    if (!transcription) {
      setMessage('Nothing to save');
      return;
    }

    if (!user) {
      setMessage('Please log in to save');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      // First, try to save with the translation column
      try {
        const { error } = await supabase
          .from('transcriptions')
          .insert([
            {
              title: title || 'Untitled Transcription',
              content: transcription,
              translation: translation,
              source_language: sourceLanguage,
              target_language: targetLanguage,
              user_id: user.id,
            },
          ])
          .select();

        if (!error) {
          setMessage('Saved successfully!');
          setTitle('');
          setTimeout(() => {
            setShowSaveForm(false);
            setMessage('');
          }, 2000);
          return;
        }

        // If we get here, there might be an error with the translation column
        if (error.message.includes('translation')) {
          throw new Error('translation_column_missing');
        } else {
          throw error;
        }
      } catch (error: unknown) {
        // If it's the translation column missing error, try without it
        const err = error as Error;
        if (err.message === 'translation_column_missing') {
          const { error: fallbackError } = await supabase
            .from('transcriptions')
            .insert([
              {
                title: title || 'Untitled Transcription',
                content: transcription,
                source_language: sourceLanguage,
                target_language: targetLanguage,
                user_id: user.id,
              },
            ])
            .select();

          if (fallbackError) throw fallbackError;

          setMessage('Saved successfully! (Translation not saved - contact admin)');
          setTitle('');
          setTimeout(() => {
            setShowSaveForm(false);
            setMessage('');
          }, 2000);
        } else {
          throw err;
        }
      }
    } catch (error: unknown) {
      console.error('Error saving transcription:', error);
      const err = error as Error;
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Save current transcription data to localStorage
      localStorage.setItem('pendingTranscription', JSON.stringify({
        transcription,
        translation,
        sourceLanguage,
        targetLanguage,
        timestamp: new Date().getTime()
      }));
      
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="save-button-container mt-4">
      {!showSaveForm ? (
        <button
          onClick={user ? () => setShowSaveForm(true) : handleGoogleSignIn}
          className="button button-secondary flex items-center justify-center gap-2 font-work-sans ml-auto"
        >
          {user ? (
            <>
              <Save className="w-4 h-4" />
              <span>Save</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign in to save</span>
            </>
          )}
        </button>
      ) : (
        <div className="save-form">
          <div className="save-form-input-group">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your transcription"
              className="save-form-input"
            />
          </div>
          
          <div className="save-form-actions">
            <button
              onClick={() => setShowSaveForm(false)}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="button button-primary flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
          
          {message && (
            <div className={`save-form-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 