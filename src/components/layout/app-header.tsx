"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserCircle, LogOut, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";

const AppHeader = () => {
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

  const handleLogout = async () => {
    try {
      const data = await fetchAPI(Routes.LOGOUT, "POST");

      if (data?.success === true) {
        localStorage.removeItem("user");
        setCurrentUser(null);
        router.push("/");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Link href="/dashboard" className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{siteConfig.name}</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        currentUser.avatarUrl ||
                        `https://picsum.photos/seed/${currentUser.id}/40/40`
                      }
                      alt={currentUser.username}
                    />
                    <AvatarFallback>
                      {currentUser.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.username}
                    </p>
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
};

export default AppHeader;
