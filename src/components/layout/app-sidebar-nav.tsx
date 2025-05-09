"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CreditCard, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
// No longer need loadUserFromStorage or useEffect here if AppLayout handles it.

export function AppSidebarNav() {
  const pathname = usePathname();
  const router = useRouter(); 
  const dispatch = useAppDispatch();
  const { user: currentUser, status: authStatus } = useAppSelector((state) => state.auth);

  // AppLayout is now responsible for the initial loadUserFromStorage.
  // This component will reflect the auth state once AppLayout resolves it.


  const handleLogout = () => { 
    dispatch(logout());
    router.push('/login');
    // router.refresh(); // Not strictly necessary
  };

  const isLoadingAuth = authStatus === 'loading' || authStatus === 'idle';


  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{siteConfig.name}</span>
          </Link>
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {siteConfig.sidebarNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-2">
         {isLoadingAuth && !currentUser ? ( // Show skeleton if loading and no user yet
            <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    <div className="space-y-1">
                        <div className="h-4 w-20 rounded bg-muted animate-pulse"></div>
                        <div className="h-3 w-24 rounded bg-muted animate-pulse"></div>
                    </div>
                </div>
            </div>
         ) : currentUser ? (
           <>
             <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.id}/40/40`} alt={currentUser.username} data-ai-hint="person avatar" />
                    <AvatarFallback>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{currentUser.username}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
             </div>
             <div className="hidden items-center justify-center group-data-[collapsible=icon]:flex">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </Button>
             </div>
           </>
         ) : null /* Render nothing if not loading and no current user (e.g. on login page) - though this sidebar is part of app layout */ }
      </SidebarFooter>
    </>
  );
}