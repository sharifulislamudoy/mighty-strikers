'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, username, requireAdmin = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Redirect to login if not authenticated
    if (!session) {
      router.push('/auth-form');
      return;
    }

    // Check if username matches
    if (session.user.username !== username) {
      // Redirect to their own dashboard
      router.push(`/player/dashboard/${session.user.username}`);
      return;
    }

    // Check admin role if required
    if (requireAdmin && session.user.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, username, router, requireAdmin]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Only render children if user is authenticated, username matches, and role requirements are met
  if (session && session.user.username === username) {
    if (requireAdmin && session.user.role !== 'admin') {
      return null; // Will be redirected by useEffect
    }
    return <>{children}</>;
  }

  return null;
}