"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserCircle, LogOut, CreditCard, Bell } from "lucide-react";
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
import { format } from "date-fns";
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
    const data = await fetchAPI(`${Routes.GET_NOTIFICATIONS}?limit=5&page=1`, "GET");
    if (data?.success) {
      setNotifications(data?.data || []);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleInvitation = async (notification: any) => {
    const data = await fetchAPI(
      Routes.ACCEPT_INVITATION + "/" + notification.groupId._id,
      "POST"
    );
    if (data?.success) {
      showToast({
        title: "Invitation accepted",
        description: "You are now a member of the group",
        type: "success",
      });
      router.push(`/group/${notification.groupId._id}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between  sm:pr-6 lg:pr-8 lg:pl-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:flex" />
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[500px] p-3" align="end">
              <div className="space-y-3">
                {notifications.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">No notifications</p>
                )}
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`rounded-md p-3 transition-all flex justify-between items-start ${
                      notification.status === "pending"
                        ? "bg-muted/50 border border-green-400"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex flex-col text-sm w-full">
                      <p>
                        <span className="font-semibold">{notification.invitedBy.username}</span>{" "}
                        invited you to join{" "}
                        <span className="font-semibold">{notification.groupId.name}</span>
                      </p>
                      <span className="text-xs text-muted-foreground mt-1">
                        Sent on {format(new Date(notification.createdAt), "dd MMM yyyy")}
                      </span>
                    </div>

                    {notification.status === "pending" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="ml-4 mt-1 bg-green-500 hover:bg-green-600 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInvitation(notification);
                        }}
                      >
                        Accept
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4 mt-1 cursor-default"
                        disabled
                      >
                        Accepted
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
