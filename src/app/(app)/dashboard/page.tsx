"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {  useAppSelector } from "@/store/hooks";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Summary from "@/components/dashboard/Summary";

export default function DashboardPage() {
   const user = useAppSelector((state) => state.auth.user);;


  console.log("This is user", user)
  return (
    <div className="space-y-8">
      <section className="bg-card p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Welcome back, {user?.username || "User"}!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Here's a quick overview of your shared expenses.
          </p>
          <div className="mt-6 space-x-0 space-y-3 sm:space-x-4 sm:space-y-0">
            <Button asChild size="lg">
              <Link href="/groups/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Group
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/groups">View My Groups</Link>
            </Button>
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
          <Image
            src="https://picsum.photos/seed/dashboard-sharebill/400/300"
            alt="Dashboard illustration"
            width={400}
            height={300}
            className="rounded-lg object-cover shadow-md"
            data-ai-hint="finance chart"
          />
        </div>
      </section>

      <Summary />

      <RecentActivity />
    </div>
  );
}
