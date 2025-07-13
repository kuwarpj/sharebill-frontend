"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
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

import { useAppDispatch } from "@/store/hooks";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";
import { showToast } from "@/lib/utils";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

 

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const body = {
      email: email,
      password: password,
    };
    try {
      const data = await fetchAPI(Routes.LOGIN, "POST", body);

      if (data?.success === true) {
        const user = data?.data; // adjust according to your API response

        // Store user and token in cookies (optional: set expiry)
        localStorage.setItem("user", JSON.stringify(user));
        showToast({ title: "Login Successful", description: "Welcome back!" });
        router.push("/dashboard");
      }
    } catch (err: any) {
      showToast({
        title: "Something went wrong",
        description: "Invalid credentials",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-sm text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="ml-1 underline hover:text-primary">
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
