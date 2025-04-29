import { useEffect, useState } from 'react';
import { Language, LANGUAGES } from '@/components/language-selector';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_SOURCE_KEY = 'qalam_source_language';
const LOCAL_STORAGE_TARGET_KEY = 'qalam_target_language';

export function useLanguagePreferences() {
  const { user } = useAuth();
  const [sourceLanguage, setSourceLanguage] = useState<Language>(
    LANGUAGES.find(lang => lang.code === "en") || LANGUAGES[0]
  );
  const [targetLanguage, setTargetLanguage] = useState<Language>(
    LANGUAGES.find(lang => lang.code === "en") || LANGUAGES[0]
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        if (user) {
          // Load from database for authenticated users
          const { data, error } = await supabase
            .from('user_preferences')
            .select('source_language_code, target_language_code')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            const sourceLanguage = LANGUAGES.find(lang => lang.code === data.source_language_code) || LANGUAGES[0];
            const targetLanguage = LANGUAGES.find(lang => lang.code === data.target_language_code) || LANGUAGES[0];
            setSourceLanguage(sourceLanguage);
            setTargetLanguage(targetLanguage);
          } else {
            // No preferences found, save current preferences
            await savePreferences(sourceLanguage, targetLanguage);
          }
        } else {
          // Load from localStorage for non-authenticated users
          const savedSourceCode = localStorage.getItem(LOCAL_STORAGE_SOURCE_KEY);
          const savedTargetCode = localStorage.getItem(LOCAL_STORAGE_TARGET_KEY);

          if (savedSourceCode) {
            const language = LANGUAGES.find(lang => lang.code === savedSourceCode);
            if (language) setSourceLanguage(language);
          }

          if (savedTargetCode) {
            const language = LANGUAGES.find(lang => lang.code === savedTargetCode);
            if (language) setTargetLanguage(language);
          }
        }
      } catch (error) {
        console.error('Error loading language preferences:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [user]);

  // Save preferences whenever they change
  const savePreferences = async (newSource: Language, newTarget: Language) => {
    try {
      if (user) {
        // Save to database for authenticated users
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            source_language_code: newSource.code,
            target_language_code: newTarget.code
          });

        if (error) throw error;
      }
      
      // Always save to localStorage as backup
      localStorage.setItem(LOCAL_STORAGE_SOURCE_KEY, newSource.code);
      localStorage.setItem(LOCAL_STORAGE_TARGET_KEY, newTarget.code);
    } catch (error) {
      console.error('Error saving language preferences:', error);
    }
  };

  const updateSourceLanguage = (language: Language) => {
    setSourceLanguage(language);
    savePreferences(language, targetLanguage);
  };

  const updateTargetLanguage = (language: Language) => {
    setTargetLanguage(language);
    savePreferences(sourceLanguage, language);
  };

  return {
    sourceLanguage,
    targetLanguage,
    updateSourceLanguage,
    updateTargetLanguage,
    isLoading
  };
} 