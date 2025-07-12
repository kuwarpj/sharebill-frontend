"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserCircle, LogOut, CreditCard, Bell, Check } from "lucide-react";
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
import { formatDate } from "date-fns";
import { showToast } from "@/lib/utils";

const AppHeader = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<null | {
    username: string;
    email: string;
    avatarUrl: string;
    id: string;
  }>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
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

  const fetchNotifications = async () => {
    const data = await fetchAPI(
      Routes.GET_NOTIFICATIONS + "?limit=5&page=1",
      "GET"
    );
    if (data?.success) {
      setNotifications(data?.data || []);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  //   {
  //     "email": "itskuwarjha@gmail.com",
  //     "groupId": {
  //         "name": "Rajan-group",
  //         "description": "",
  //         "id": "68711f709bf52922349a454b"
  //     },
  //     "invitedBy": "6870f312cd0cc7f1a07c2151",
  //     "status": "pending",
  //     "createdAt": "2025-07-11T14:28:00.546Z",
  //     "expiresAt": "2025-07-18T14:28:00.547Z",
  //     "id": "68711f709bf52922349a4551"
  // }

  const handleInvitation = async (notification: any) => {
    const data = await fetchAPI(
      Routes.ACCEPT_INVITATION + "/" + notification.groupId.id,
      "POST"
    );
    if (data?.success) {
      showToast({
        title: "Invitation accepted",
        description: "You are now a member of the group",
        type: "success",
      });
      router.push(`/group/${notification.groupId.id}`);
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96" align="end">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleInvitation(notification)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex flex-col w-full">
                      <span>
                        <span className="font-bold">
                          {notification.groupId.name}
                        </span>{" "}
                        invited you to join their group
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt, "dd MMM yyyy")}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
