import type { NavItem } from '@/types';
import { LayoutDashboard, Users, History, UserCircle } from 'lucide-react';

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mainNav: NavItem[];
  sidebarNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: 'ShareBill',
  description: 'An application to manage shared expenses easily.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002', 
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/og.jpg`,
  mainNav: [], // Main header navigation items, if any
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/', // This will now point to src/app/(app)/page.tsx
      icon: LayoutDashboard,
    },
    {
      title: 'Groups',
      href: '/groups', // This will point to src/app/(app)/groups/page.tsx
      icon: Users,
    },
    {
      title: 'Activity',
      href: '/activity', // This will point to src/app/(app)/activity/page.tsx
      icon: History,
    },
    {
      title: 'Account',
      href: '/account', // This will point to src/app/(app)/account/page.tsx
      icon: UserCircle,
    },
  ],
};
