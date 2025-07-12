
"use client"; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRightLeft, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroups } from "@/store/slices/groupSlice";
import RecentActivity from "@/components/dashboard/RecentActivity";


// Mock data - will be replaced by Redux state and API calls
const mockRecentActivity = [
  { id: "1", description: "Lunch with colleagues", group: "Work Friends", amount: "$15.00 owed", date: "2024-07-28" },
  { id: "2", description: "Groceries", group: "Roommates", amount: "$25.00 paid", date: "2024-07-27" },
  { id: "3", description: "Movie tickets", group: "Weekend Hangout", amount: "$10.00 owed", date: "2024-07-26" },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { groups, status: groupStatus } = useAppSelector(state => state.groups);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if(groupStatus === 'idle' && user) {
        dispatch(fetchGroups());
    }
  }, [dispatch, groupStatus, user]);

  const calculateTotalBalance = () => {
    let balance = 0;
    groups.forEach(group => {
        if(typeof group.currentUserBalance === 'number'){
            balance += group.currentUserBalance;
        }
    });
    return balance;
  }
  const totalBalance = calculateTotalBalance();
  const groupCount = groups.length; 

  const summaryData = [
    { title: "Total Balance", value: `$${totalBalance.toFixed(2)}`, description: totalBalance < 0 ? "You owe overall" : totalBalance > 0 ? "You are owed overall" : "Settled up overall", icon: <ArrowRightLeft className="h-6 w-6 text-primary" /> },
    { title: "Groups You're In", value: groupCount.toString(), description: "Active groups", icon: <Users className="h-6 w-6 text-primary" /> },
  ];


  return (
    <div className="space-y-8">
      <section className="bg-card p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome back, {user?.username || "User"}!</h1>
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
              <Link href="/groups">
                View My Groups
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
           <Image src="https://picsum.photos/seed/dashboard-sharebill/400/300" alt="Dashboard illustration" width={400} height={300} className="rounded-lg object-cover shadow-md" data-ai-hint="finance chart" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Your Overview</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {summaryData.map((item) => (
            <Card key={item.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${item.title === "Total Balance" && totalBalance < 0 ? 'text-destructive' : item.title === "Total Balance" && totalBalance > 0 ? 'text-green-600' : ''}`}>{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

     <RecentActivity />
    </div>
  );
}

    