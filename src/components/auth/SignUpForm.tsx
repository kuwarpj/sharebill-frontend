"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

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
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";
import { showToast } from "@/lib/utils";

interface FormData {
  email: string;
  otp: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const sendOtp = async () => {
    setIsLoading(true);
    const body = {
      email: formData.email,
    };
    try {
      const data = await fetchAPI(Routes.SEND_OPT, "POST", body);
      showToast({ title: "OTP sent", description: "Check your email inbox." });
      setStep(2);
    } catch (err: any) {
      showToast({
        title: "Failed to send OTP",
        description: err.message || "Try again",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    const { email, otp, username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      showToast({ title: "Passwords do not match", type: "error" });
      return;
    }
    const body = {
      email: email,
      otp: otp,
      username: username,
      password: password,
    };

    setIsLoading(true);
    try {
      const data = await fetchAPI(Routes.VERIFY_OPT, "POST", body); // ✅ send all signup data

      showToast({ title: "Signup Successful", description: "Redirecting..." });
      router.push("/dashboard");
    } catch (err: any) {
      showToast({
        title: "Signup Failed",
        description: err.message || "Try again",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          {step === 1
            ? "Enter your email to receive an OTP"
            : "Complete your signup"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={
            step === 1
              ? (e) => {
                  e.preventDefault();
                  sendOtp();
                }
              : handleSignup
          }
          className="space-y-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading || step === 2}
              required
            />
          </div>

          {step === 2 && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your name"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : step === 1 ? "Send OTP" : "Sign Up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="ml-1 underline hover:text-primary">
          Sign In
        </a>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
