"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LANGUAGES } from '@/components/language-selector';

type TranscriptionDetailProps = {
  params: {
    id: string;
  };
};

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

export default function TranscriptionDetail({ params }: TranscriptionDetailProps) {
  const { id } = params;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchTranscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('transcriptions')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setTranscription(data);
        } else {
          setError('Transcription not found');
        }
      } catch (error) {
        console.error('Error fetching transcription:', error);
        setError('Could not load transcription');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && mounted) {
      fetchTranscription();
    }
  }, [id, user, authLoading, mounted]);

  const handleDelete = async () => {
    if (!transcription) return;
    
    if (window.confirm("Are you sure you want to delete this transcription?")) {
      try {
        const { error } = await supabase
          .from('transcriptions')
          .delete()
          .eq('id', transcription.id);
        
        if (error) throw error;
        
        router.push('/transcriptions');
      } catch (error) {
        console.error('Error deleting transcription:', error);
        alert('Failed to delete transcription. Please try again.');
      }
    }
  };

  // Don't render until client-side has mounted
  if (!mounted || authLoading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="container header-content">
            <h1 className="font-work-sans font-medium">Transcription Details</h1>
          </div>
        </header>
        <main className="app-main container">
          <p>Please sign in to view transcription details.</p>
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
          <h1 className="font-work-sans font-medium">Transcription Details</h1>
          <div className="header-actions">
            <Link href="/transcriptions" className="theme-toggle" aria-label="Back to transcriptions" title="Back to transcriptions">
              <ArrowLeft className="theme-icon" />
            </Link>
          </div>
        </div>
      </header>

      <main className="app-main container max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/transcriptions" className="button button-secondary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Transcriptions
            </Link>
          </div>
        ) : transcription ? (
          <div className="transcription-detail">
            <div className="transcription-detail-header">
              <div>
                <h2 className="transcription-detail-title">{transcription.title || 'Untitled'}</h2>
                {transcription.created_at && (
                  <p className="transcription-detail-date">
                    Saved on {new Date(transcription.created_at).toLocaleDateString()} at {new Date(transcription.created_at).toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              <button
                className="button button-danger inline-flex items-center gap-2"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete Transcription
              </button>
            </div>
            
            <div className="transcription-detail-content">
              <div className="transcription-detail-panel">
                <div className="transcription-detail-panel-header">
                  <h3 className="transcription-detail-panel-title">Original</h3>
                  {transcription.source_language && (
                    <div className="transcription-detail-language">
                      <span className="language-flag">{getLanguageFlag(transcription.source_language)}</span>
                      <span>{getLanguageName(transcription.source_language)}</span>
                    </div>
                  )}
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{transcription.content}</p>
                </div>
              </div>
              
              {transcription.translation && (
                <div className="transcription-detail-panel">
                  <div className="transcription-detail-panel-header">
                    <h3 className="transcription-detail-panel-title">Translation</h3>
                    {transcription.target_language && (
                      <div className="transcription-detail-language">
                        <span className="language-flag">{getLanguageFlag(transcription.target_language)}</span>
                        <span>{getLanguageName(transcription.target_language)}</span>
                      </div>
                    )}
                  </div>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{transcription.translation}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-8">
              <Link href="/transcriptions" className="button button-secondary inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Transcriptions
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p>Transcription not found</p>
            <Link href="/transcriptions" className="button button-secondary mt-4 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Transcriptions
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 