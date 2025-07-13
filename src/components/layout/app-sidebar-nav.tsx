"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CreditCard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";
import { useEffect, useState } from "react";
import { logoutUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

export function AppSidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<null | {
    username: string;
    email: string;
    avatarUrl: string;
    id: string;
  }>(null);

  useEffect(() => {
    const UserData = localStorage.getItem("user");
    if (UserData) {
      try {
        const user = JSON.parse(UserData);
        setCurrentUser(user);
      } catch (err) {
        console.error("Invalid user cookie");
        setCurrentUser(null);
      }
    }
  }, []);
  // const handleLogout = async () => {
  //   try {
  //     const data = await fetchAPI(Routes.LOGOUT, "POST");

  //     if (data?.success === true) {
  //       localStorage.removeItem("user");
  //       setCurrentUser(null);
  //       router.push("/");
  //     }
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   }
  // };
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await dispatch(logoutUser()); 
    router.push("/login");
  };

  return (
    <>
      <SidebarHeader className="border-b py-[18px]">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">{siteConfig.name}</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarMenu>
          {siteConfig.sidebarNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/" &&
                    pathname.startsWith(item.href))
                }
                tooltip={item.title}
                className="py-5"
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
        {!currentUser ? (
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
                  <AvatarImage
                    src={
                      currentUser.avatarUrl ||
                      `https://picsum.photos/seed/${currentUser.id}/40/40`
                    }
                    alt={currentUser.username}
                    data-ai-hint="person avatar"
                  />
                  <AvatarFallback>
                    {currentUser.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{currentUser.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
            <div className="hidden items-center justify-center group-data-[collapsible=icon]:flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </>
        ) : null}
      </SidebarFooter>
    </>
  );
}
