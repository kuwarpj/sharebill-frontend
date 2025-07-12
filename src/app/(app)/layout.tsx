"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebarNav } from "@/components/layout/app-sidebar-nav";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AppHeader from "@/components/layout/app-header";


export default function AppLayout({ children }: { children: React.ReactNode }) {
 

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <AppSidebarNav />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
