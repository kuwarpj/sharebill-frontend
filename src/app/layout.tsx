import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ReduxProvider } from "@/components/providers/ReduxProvider"; // Import ReduxProvider
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShareBill - Expense Sharing Made Easy",
  description:
    "ShareBill helps you track shared expenses with friends and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Loader = () => {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Suspense fallback={<Loader />}>
            {/* Wrap with ReduxProvider */}
            <QueryProvider>
              {" "}
              {/* ✅ Wrap Redux with Query */}
              {children}
              <Toaster />
            </QueryProvider>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
