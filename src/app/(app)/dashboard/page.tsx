
"use client"; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRightLeft, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroups } from "@/store/slices/groupSlice";


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

  // Placeholder for status and error from a potential dashboard slice
  const status = 'succeeded'; 
  const error = null; 


  useEffect(() => {
    if(groupStatus === 'idle' && user) { // Fetch groups if user is loaded and groups are not
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


  // if (status === 'loading') {
  //   return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  // }

  // if (status === 'failed') {
  //   return (
  //     <div className="space-y-6 text-center">
  //       <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
  //       <h1 className="text-2xl font-semibold">Failed to load dashboard</h1>
  //       <p className="text-muted-foreground">{error || "An unexpected error occurred."}</p>
  //       <Button onClick={() => { if(user) dispatch(fetchGroups()) }}>Try Again</Button>
  //     </div>
  //   );
  // }

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

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Recent Activity</h2>
        {mockRecentActivity.length > 0 ? (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {mockRecentActivity.map((activity) => (
                  <li key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">In: {activity.group}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${activity.amount.includes('owed') ? 'text-destructive' : activity.amount.includes('paid') ? 'text-green-600' : ''}`}>{activity.amount}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
                <Button variant="link" asChild className="mx-auto">
                    <Link href="/activity">View all activity</Link>
                </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <Image src="https://picsum.photos/seed/no-dashboard-activity/200/200" alt="No activity illustration" width={150} height={150} className="mb-4 rounded-lg" data-ai-hint="empty document" />
              <p className="text-lg font-medium">No recent activity yet.</p>
              <p className="text-muted-foreground">Add some expenses to get started!</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

    