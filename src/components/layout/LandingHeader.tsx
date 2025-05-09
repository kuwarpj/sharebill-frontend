
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { CreditCard, LogIn, UserPlus } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export function LandingHeader() {
  const { token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <CreditCard className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl sm:text-2xl inline-block">{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">
                  <LogIn className="mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  <UserPlus className="mr-0 sm:mr-2 h-4 w-4" />
                 <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

    