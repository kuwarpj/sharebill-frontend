"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebarNav } from "@/components/layout/app-sidebar-nav";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loadAuthDataFromCookies,
  fetchCurrentUser,
  logout,
} from "@/store/slices/authSlice";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const {
    token,
    user,
    status: authStatus,
  } = useAppSelector((state) => state.auth);

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
