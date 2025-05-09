import { UserAuthForm } from "@/components/auth/user-auth-form";
import type { Metadata } from "next"; 

export const metadata: Metadata = {
  title: "Login - ShareBill",
  description: "Login to your ShareBill account.",
};

export default function LoginPage() {
  return <UserAuthForm formType="login" />;
}
