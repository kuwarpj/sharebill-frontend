import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: UserProfile[];
  createdAt: string;
  iconUrl?: string;
  // Add balance information related to the current user if needed
  currentUserBalance?: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: UserProfile; // Who paid the expense
  splitType: "equal" | "custom"; // For now, 'equal'
  participants: UserProfile[]; // Who participated in the expense
  createdAt: string;
  category?: string;
}

export interface Transaction {
  id: string;
  fromUser: UserProfile;
  toUser: UserProfile;
  amount: number;
  groupId: string;
  settled: boolean;
  createdAt: string;
}

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";
export type ToastType = "success" | "error" | "warning";
export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
}
