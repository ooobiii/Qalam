"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../app/lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side only code
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            const newUser = session?.user || null;
            
            // If user just logged in and we have pending data in localStorage
            if (newUser && event === 'SIGNED_IN') {
              checkForPendingTranscription();
            }
            
            setUser(newUser);
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isMounted]); // Only depend on isMounted
  
  // Function to check for pending transcription data
  const checkForPendingTranscription = () => {
    if (!isMounted) return;
    
    try {
      const pendingData = localStorage.getItem('pendingTranscription');
      if (pendingData) {
        // We don't immediately remove it - we'll let the TranscriptionSection component handle that
        console.log('Found pending transcription data to restore');
      }
    } catch (error) {
      console.error('Error checking for pending transcription:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 