"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserCircle, LogOut, Settings, CreditCard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
// No longer need loadUserFromStorage or useEffect here if AppLayout handles it.


export function AppHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: currentUser, status: authStatus } = useAppSelector((state) => state.auth);

  // AppLayout is now responsible for the initial loadUserFromStorage.
  // This component will reflect the auth state once AppLayout resolves it.

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
    // router.refresh(); // Not strictly necessary, logout + push should trigger layout re-evaluation
  };
  
  // isLoadingAuth should primarily reflect if we're still waiting for AppLayout's initial auth resolution.
  // If AppLayout shows a loading screen, this header might not even render or might render in a skeleton state.
  const isLoadingAuth = authStatus === 'loading' || authStatus === 'idle';


  if (isLoadingAuth && !currentUser) { // Show skeleton if loading and no user yet
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Link href="/" className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">{siteConfig.name}</span>
            </Link>
          </div>
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div> {/* Skeleton for user avatar area */}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Link href="/" className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{siteConfig.name}</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.id}/40/40`} alt={currentUser.username} data-ai-hint="person avatar" />
                    <AvatarFallback>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                   <Link href="/account#settings"> 
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
          )}
        </div>
      </div>
    </header>
  );
}