"use client";

import { useState, useEffect, useCallback, FormEvent } from "react"; // Updated import
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, signupUser, clearAuthError } from "@/store/slices/authSlice";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  formType: "login" | "signup";
}

export function UserAuthForm({ className, formType, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { status, error: authError } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, formType]);

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearAuthError()); 

    let action;
    if (formType === "login") {
      action = dispatch(loginUser({ email, password }));
    } else {
      action = dispatch(signupUser({ username, email, password }));
    }

    try {
      const resultAction = await action;
      if (loginUser.fulfilled.match(resultAction) || signupUser.fulfilled.match(resultAction)) {
        toast({
          title: formType === "login" ? "Login Successful" : "Signup Successful",
          description: formType === "login" ? "Welcome back!" : "Your account has been created.",
        });
        router.push("/"); 
      } else if (loginUser.rejected.match(resultAction) || signupUser.rejected.match(resultAction)) {
         toast({
          title: formType === "login" ? "Login Failed" : "Signup Failed",
          description: (resultAction.payload as string) || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: formType === "login" ? "Login Failed" : "Signup Failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }, [dispatch, formType, email, password, username, toast, router]);
  
  useEffect(() => {
    if (authError && status === 'failed') {
      toast({
        title: formType === "login" ? "Login Failed" : "Signup Failed",
        description: authError,
        variant: "destructive",
      });
    }
  }, [authError, status, formType, toast, dispatch]);

  const isLoading = status === 'loading';

  return (
    <Card className={cn("w-full max-w-md shadow-xl", className)} {...props}>
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center mb-4">
           <CreditCard className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">
          {formType === "login" ? "Welcome Back!" : "Create an Account"}
        </CardTitle>
        <CardDescription>
          {formType === "login"
            ? "Enter your credentials to access your account."
            : "Fill in the details below to create your new account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {formType === "signup" && (
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your Username"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Your Password"
              type="password"
              autoCapitalize="none"
              autoComplete={formType === "login" ? "current-password" : "new-password"}
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={formType === "signup" ? 6 : undefined}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {formType === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="px-8 text-center text-sm text-muted-foreground">
          {formType === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign In
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
