
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import LandingPageContent from '@/components/landing/LandingPageContent';
import { LandingHeader } from '@/components/layout/LandingHeader';

export default function RootPage() {
  const router = useRouter();


  // if (status === 'loading' || (status === 'succeeded' && token && user)) {
  //   return (
  //       <div className="flex flex-col min-h-screen">
  //           <LandingHeader />
  //           <main className="flex-grow flex items-center justify-center">
  //                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  //           </main>
  //           <footer className="py-8 border-t border-border/40 bg-background">
  //               <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
  //                   <p>&copy; {new Date().getFullYear()} ShareBill. All rights reserved.</p>
  //               </div>
  //           </footer>
  //       </div>
  //   );
  // }

  return (
    <>
      <LandingHeader />
      <main>
        <LandingPageContent />
      </main>
    </>
  );
}
