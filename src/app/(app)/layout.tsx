// src/app/(app)/layout.tsx
"use client"; 

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadAuthDataFromCookies, fetchCurrentUser, logout } from '@/store/slices/authSlice';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { token, user, status: authStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (authStatus === 'idle') {
      dispatch(loadAuthDataFromCookies());
    }
  }, [dispatch, authStatus]);

  useEffect(() => {
    if (authStatus === 'idle' || authStatus === 'loading') {
      return; 
    }

    if (authStatus === 'succeeded') {
      if (token && user) {
        return; 
      } else if (token && !user) {
        dispatch(fetchCurrentUser()).unwrap().catch(() => {
          // Error handled by fetchCurrentUser.rejected, which sets status to 'failed'
        });
        return; 
      }
    }
    
    // If authStatus is 'failed', or 'succeeded' but token/user issues persist
    if (pathname !== '/login') { // Avoid redirect loop if already on login
      dispatch(logout()); 
      router.replace('/login');
    }

  }, [token, user, authStatus, router, dispatch, pathname]);

  const showLoadingScreen = authStatus === 'idle' || authStatus === 'loading';

  if (showLoadingScreen) {
    return <div className="flex items-center justify-center min-h-screen">Authenticating...</div>;
  }

  if (!token || !user) {
    if (pathname !== '/login') {
        router.replace('/login');
    }
    return <div className="flex items-center justify-center min-h-screen">Preparing application...</div>; 
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <AppSidebarNav />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
