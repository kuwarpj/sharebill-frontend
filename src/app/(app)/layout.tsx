// src/app/(app)/layout.tsx
"use client"; 

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadUserFromStorage, fetchCurrentUser, logout } from '@/store/slices/authSlice';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const dispatch = useAppDispatch();
  const { token, user, status: authStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // This effect runs once on mount or if dispatch/authStatus changes.
    // It attempts to load user from storage if current status is 'idle'.
    if (authStatus === 'idle') {
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, authStatus]);

  useEffect(() => {
    // Don't run redirection logic if initial auth status is still resolving
    if (authStatus === 'idle' || authStatus === 'loading') {
      return; // UI will show loading screen
    }

    // At this point, authStatus is 'succeeded' or 'failed'.
    if (authStatus === 'succeeded') {
      if (token && user) {
        // All good, user is authenticated and data is present.
        return; // Render children
      } else if (token && !user) {
        // Token exists (likely from storage), but user data is missing. Fetch it.
        // fetchCurrentUser will set status to 'loading', then 'succeeded' or 'failed'.
        dispatch(fetchCurrentUser()).unwrap().catch(() => {
          // Failure is handled by fetchCurrentUser.rejected setting status to 'failed',
          // which will be caught in the next run of this effect.
        });
        return; // UI will show loading screen while fetchCurrentUser runs
      }
    }
    
    // If authStatus is 'failed', 
    // OR if 'succeeded' but token/user inconsistencies persist (e.g. !token after 'succeeded'),
    // OR if no token after all checks:
    // This signifies user is not authenticated or auth state is invalid.
    // Check if already on login page to prevent redirect loop if logout is dispatched from login page itself.
    if (pathname !== '/login') {
      dispatch(logout()); // Clear any partial auth state, this also sets status to 'idle'
      router.replace('/login');
    }

  }, [token, user, authStatus, router, dispatch, pathname]);

  // Determine if UI should be in a loading state
  const showLoadingScreen = authStatus === 'idle' || authStatus === 'loading';

  if (showLoadingScreen) {
    return <div className="flex items-center justify-center min-h-screen">Authenticating...</div>;
  }

  // If not loading, and the useEffect hasn't redirected, we should have a valid token and user.
  // This is a final guard. If this is hit, it implies an unexpected state.
  if (!token || !user) {
    // This path should ideally not be hit if the useEffect logic and authSlice are correct.
    // It indicates a state where not loading, but also not properly authenticated for app content.
    // The useEffect should have handled redirection.
    // console.warn("AppLayout: Fallback guard hit - no token/user but not loading. Redirecting.");
    if (pathname !== '/login') { // Avoid redirect loop if something went wrong on login itself.
        router.replace('/login');
    }
    return <div className="flex items-center justify-center min-h-screen">Preparing application...</div>; 
  }

  // Authenticated and user data is available
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