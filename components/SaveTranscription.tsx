"use client";

import { useState } from 'react';
import { supabase } from '../app/lib/supabase';
import { Save } from 'lucide-react';

type SaveTranscriptionProps = {
  content: string;
  sourceLanguage: string;
  targetLanguage: string;
};

export default function SaveTranscription({
  content,
  sourceLanguage,
  targetLanguage,
}: SaveTranscriptionProps) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!content) {
      setMessage('Nothing to save');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      const { error } = await supabase
        .from('transcriptions')
        .insert([
          {
            title: title || 'Untitled Transcription',
            content,
            source_language: sourceLanguage,
            target_language: targetLanguage,
          },
        ])
        .select();

      if (error) throw error;

      setMessage('Saved successfully!');
      setTitle('');
    } catch (error: unknown) {
      console.error('Error saving transcription:', error);
      const err = error as Error;
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 space-y-2 md:space-y-3 w-full max-w-full">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Transcription title"
        className="w-full px-3 py-2 border rounded-md font-work-sans"
      />
      <button
        onClick={handleSave}
        disabled={saving || !content}
        className="button button-primary w-full flex items-center justify-center gap-2 font-work-sans"
      >
        {saving ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="mic-icon" />
            <span>Save Transcription</span>
          </>
        )}
      </button>
      {message && (
        <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
} 