"use client";

import { useState } from 'react';
import { supabase } from '../app/lib/supabase';
import { LogIn, LogOut, BookText } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function AuthButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Return either sign-in or bookmarks + sign-out buttons
  if (!user) {
    return (
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="theme-toggle"
        aria-label="Sign in"
        title="Sign in with Google"
      >
        {loading ? (
          <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
        ) : (
          <LogIn className="theme-icon" />
        )}
      </button>
    );
  }

  return (
    <>
      <button
        className="theme-toggle"
        aria-label="My Transcriptions"
        title="My Transcriptions"
        onClick={() => window.location.href = '/transcriptions'}
      >
        <BookText className="theme-icon" />
      </button>
      
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="theme-toggle"
        aria-label="Sign out"
        title="Sign out"
      >
        {loading ? (
          <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
        ) : (
          <LogOut className="theme-icon" />
        )}
      </button>
    </>
  );
} 