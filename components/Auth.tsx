"use client";

import { useAuth } from './AuthProvider';
import AuthButton from './AuthButton';
import { useEffect, useState } from 'react';

export default function Auth() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything meaningful until client-side has mounted
  if (!mounted || loading) {
    return <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>;
  }

  // Just return the components directly without a wrapper so spacing is consistent
  return user ? (
    <>
      <span className="text-sm font-work-sans">{user.user_metadata?.full_name?.split(' ')[0] || ''}</span>
      <AuthButton />
    </>
  ) : (
    <AuthButton />
  );
} 