"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import { Trash2, ArrowLeft, Eye, Calendar, Clock } from 'lucide-react';
import { LANGUAGES } from '@/components/language-selector';

type Transcription = {
  id: string;
  title: string;
  content: string;
  translation?: string;
  source_language?: string;
  target_language?: string;
  created_at: string;
  user_id: string;
};

export default function TranscriptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Helper function to get language flag emoji
  const getLanguageFlag = (code?: string) => {
    if (!code) return '';
    const language = LANGUAGES.find(lang => lang.code === code);
    return language?.flag || '';
  };

  // Helper function to get language name
  const getLanguageName = (code?: string) => {
    if (!code) return '';
    const language = LANGUAGES.find(lang => lang.code === code);
    return language?.name || code;
  };

  // Add a mounted check to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('transcriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTranscriptions(data || []);
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && mounted) {
      fetchTranscriptions();
    }
  }, [user, authLoading, mounted]);

  const handleDeleteTranscription = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transcription?")) {
      try {
        const { error } = await supabase
          .from('transcriptions')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setTranscriptions(transcriptions.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting transcription:', error);
        alert('Failed to delete transcription. Please try again.');
      }
    }
  };

  // Don't render anything until client-side has mounted
  if (!mounted) {
    return <div className="container py-10">Loading...</div>;
  }

  if (authLoading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="container header-content">
            <h1 className="font-work-sans font-medium">My Transcriptions</h1>
          </div>
        </header>
        <main className="app-main container">
          <p>Please sign in to view your saved transcriptions.</p>
          <Link href="/" className="button button-secondary mt-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go back home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-content">
          <h1 className="font-work-sans font-medium">My Transcriptions</h1>
          <div className="header-actions">
            <Link href="/" className="theme-toggle" aria-label="Back to home" title="Back to home">
              <ArrowLeft className="theme-icon" />
            </Link>
          </div>
        </div>
      </header>

      <main className="app-main container max-w-7xl">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : transcriptions.length === 0 ? (
          <div className="text-center py-10">
            <p>You don&apos;t have any saved transcriptions yet.</p>
            <Link href="/" className="button button-secondary mt-4 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Transcribe
            </Link>
          </div>
        ) : (
          <div className="transcription-grid">
            {transcriptions.map((transcription) => (
              <div
                key={transcription.id}
                className="transcription-card"
              >
                <div className="transcription-card-content">
                  <h2 className="transcription-card-title">{transcription.title || 'Untitled'}</h2>
                  
                  <div className="transcription-card-info">
                    {transcription.created_at && (
                      <div className="transcription-card-date">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(transcription.created_at).toLocaleDateString()}</span>
                        <Clock className="w-3.5 h-3.5 ml-2" />
                        <span>{new Date(transcription.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="transcription-card-languages">
                    {transcription.source_language && (
                      <div className="transcription-card-language">
                        <span className="language-flag">{getLanguageFlag(transcription.source_language)}</span>
                        <span>{getLanguageName(transcription.source_language)}</span>
                      </div>
                    )}
                    
                    {transcription.target_language && (
                      <div className="transcription-card-language">
                        <span className="language-flag">{getLanguageFlag(transcription.target_language)}</span>
                        <span>{getLanguageName(transcription.target_language)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="transcription-card-actions">
                  <Link 
                    href={`/transcriptions/${transcription.id}`}
                    className="transcription-card-view-btn"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                  
                  <button
                    className="transcription-card-delete-btn"
                    onClick={() => handleDeleteTranscription(transcription.id)}
                    aria-label="Delete transcription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 