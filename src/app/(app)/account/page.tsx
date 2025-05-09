"use client";

import { useState, useEffect, useCallback, FormEvent } from "react"; // Updated import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Mail, Shield, Edit3, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";
// TODO: Import an update user profile thunk from authSlice or a dedicated userSlice when created

export default function AccountPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user: currentUser, status: authStatus } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); 
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (!currentUser && authStatus !== 'loading') {
      dispatch(fetchCurrentUser());
    }
  }, [currentUser, authStatus, dispatch]);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (darkModeEnabled) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
  }, [darkModeEnabled]);

  useEffect(() => {
     if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkModeEnabled(true);
        } else {
             setDarkModeEnabled(false); 
        }
     }
  }, []);

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Update account data:", { username, email });

    // TODO: Replace with actual API call using a Redux thunk for user profile update
    // For example: dispatch(updateUserProfile({ id: currentUser?.id, username, email })).unwrap()
    //   .then(() => { ... })
    //   .catch((err) => { ... })
    //   .finally(() => setIsLoading(false));

    await new Promise((resolve) => setTimeout(resolve, 1500)); 
    
    toast({
      title: "Account Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsLoading(false);
    setIsEditing(false);
  }, [username, email, toast, setIsLoading, setIsEditing, dispatch, currentUser?.id]); // Added dispatch and currentUser?.id for future thunk

  const handleToggleEdit = useCallback(() => {
    if(isEditing) {
        if(currentUser) {
            setUsername(currentUser.username);
            setEmail(currentUser.email);
        }
    }
    setIsEditing(!isEditing);
  }, [isEditing, currentUser, setIsEditing, setUsername, setEmail]);

  if (authStatus === 'loading' || !currentUser) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <UserCircle className="mr-3 h-8 w-8 text-primary" /> My Account
        </h1>
        <Button onClick={handleToggleEdit} variant={isEditing ? "outline" : "default"}>
          {isEditing ? <><Save className="mr-2 h-4 w-4" /> Save Changes</> : <><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</>}
        </Button>
      </div>

      <Card className="shadow-lg">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.username}/128/128`} alt={currentUser.username} data-ai-hint="person large_avatar"/>
                <AvatarFallback className="text-3xl">{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{currentUser.username}</CardTitle>
                <CardDescription>{currentUser.email}</CardDescription>
                {isEditing && <Button size="sm" variant="outline" className="mt-2">Change Avatar</Button>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  disabled={!isEditing || isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                  required
                  minLength={3}
                  maxLength={30}
                />
                {username.length > 0 && username.length < 3 && (
                     <p className="text-sm text-destructive mt-1">Username must be at least 3 characters.</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled={!isEditing || isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {isEditing && (
                 <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password (Optional)</Label>
                    <Input id="newPassword" type="password" placeholder="Leave blank to keep current password" disabled={isLoading} className="mt-1" />
                </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && (
                  <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Save Profile Changes
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Shield className="mr-2 h-5 w-5 text-primary" /> Security & Preferences</CardTitle>
          <CardDescription>Manage your account security and application settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="notifications" className="font-medium">Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about group activities and settlements.</p>
                </div>
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <Separator />
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="darkMode" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                </div>
                <Switch id="darkMode" checked={darkModeEnabled} onCheckedChange={setDarkModeEnabled} />
            </div>
             <Separator />
            <div>
                <Button variant="outline">Change Password</Button>
            </div>
        </CardContent>
         <CardFooter className="border-t pt-6">
            <Button variant="destructive">Delete Account</Button>
         </CardFooter>
      </Card>
    </div>
  );
}
