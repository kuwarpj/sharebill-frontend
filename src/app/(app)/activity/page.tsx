import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ListFilter, Download, Users as UsersIcon, DollarSign as DollarSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ActivityIcons } from "@/components/activity/ActivityIcons";


// Mock data - replace with actual data fetching
const mockActivity = [
  { id: "act1", type: "expense_added", description: "Lunch with colleagues", group: "Work Friends", amount: "$15.00 (you owe $7.50)", date: "2024-07-28", user: "Alice paid" },
  { id: "act2", type: "expense_added", description: "Groceries", group: "Roommates", amount: "$25.00 (you paid)", date: "2024-07-27", user: "You paid" },
  { id: "act3", type: "group_joined", description: "Joined 'Weekend Hangout'", group: "Weekend Hangout", date: "2024-07-26", user: "You" },
  { id: "act4", type: "settlement", description: "Bob settled up with you", group: "Trip to Goa", amount: "$50.00", date: "2024-07-25", user: "Bob to You" },
  { id: "act5", type: "expense_added", description: "Movie tickets", group: "Weekend Hangout", amount: "$30.00 (you owe $10.00)", date: "2024-07-26", user: "Charlie paid" },
];

export default function ActivityPage() {
  // In a real app, you would fetch activity data here
  const activities = mockActivity;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
          <p className="text-muted-foreground">
            A chronological history of your expenses, settlements, and group activities.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filter</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      {activities.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {activities.map((activity) => (
                <li key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        {activity.type === 'expense_added' && <History className="h-5 w-5 text-primary flex-shrink-0" />}
                        {activity.type === 'group_joined' && <ActivityIcons.Users className="h-5 w-5 text-green-500 flex-shrink-0" />}
                        {activity.type === 'settlement' && <ActivityIcons.DollarSign className="h-5 w-5 text-blue-500 flex-shrink-0" />}
                        <div>
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">
                                In: <span className="font-semibold text-foreground">{activity.group}</span>
                                {activity.user && ` • By: ${activity.user}`}
                            </p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                      {activity.amount && <p className="font-semibold">{activity.amount}</p>}
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  {activity.type === "expense_added" && <Badge variant="secondary" className="mt-1 sm:ml-8 capitalize">{activity.type.replace("_", " ")}</Badge>}
                  {activity.type === "group_joined" && <Badge variant="default" className="mt-1 sm:ml-8 capitalize bg-green-500 hover:bg-green-600">{activity.type.replace("_", " ")}</Badge>}
                  {activity.type === "settlement" && <Badge variant="default" className="mt-1 sm:ml-8 capitalize bg-blue-500 hover:bg-blue-600">{activity.type.replace("_", " ")}</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <Image src="https://picsum.photos/seed/no-activity-feed/200/200" alt="No activity illustration" width={150} height={150} className="mb-4 rounded-lg" data-ai-hint="empty state calendar" />
            <h3 className="text-xl font-medium">No Activity Yet</h3>
            <p className="text-muted-foreground mt-1">
              Your recent actions will appear here. Start by creating a group or adding an expense.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
