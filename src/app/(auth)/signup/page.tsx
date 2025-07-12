import SignupForm from "@/components/auth/SignUpForm";
import type { Metadata } from "next"; // Use 'import type'

export const metadata: Metadata = {
  title: "Sign Up - ShareBill",
  description: "Create a new ShareBill account.",
};

export default function SignupPage() {
  return <SignupForm/>;
}
