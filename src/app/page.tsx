
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadAuthDataFromCookies } from '@/store/slices/authSlice';
import LandingPageContent from '@/components/landing/LandingPageContent';
import { LandingHeader } from '@/components/layout/LandingHeader';

export default function RootPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'idle' && typeof window !== 'undefined') {
      // Only attempt load if no other attempt has been marked for this session on this page
      // This is a simple flag to prevent re-dispatching if user navigates back and forth quickly
      // while initial load is still somehow 'idle'.
      if (!sessionStorage.getItem('rootPageLoadAttempted')) {
         dispatch(loadAuthDataFromCookies());
         sessionStorage.setItem('rootPageLoadAttempted', 'true');
      }
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === 'succeeded' && token && user) {
      router.replace('/dashboard');
    }
  }, [router, token, user, status]);

  if (status === 'loading' || (status === 'succeeded' && token && user)) {
    return (
        <div className="flex flex-col min-h-screen">
            <LandingHeader />
            <main className="flex-grow flex items-center justify-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </main>
            <footer className="py-8 border-t border-border/40 bg-background">
                <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} ShareBill. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
  }

  return (
    <>
      <LandingHeader />
      <main>
        <LandingPageContent />
      </main>
    </>
  );
}
