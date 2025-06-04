
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
  mainNav: [], 
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/dashboard', 
      icon: LayoutDashboard,
    },
    {
      title: 'Groups',
      href: '/groups', 
      icon: Users,
    },
    // {
    //   title: 'Activity',
    //   href: '/activity', 
    //   icon: History,
    // },
    {
      title: 'Account',
      href: '/account', 
      icon: UserCircle,
    },
  ],
};

    