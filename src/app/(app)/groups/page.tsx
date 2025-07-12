import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GroupList from "@/components/groups/GroupList";

const GroupsPage = async () => {
  // const data = await fetchAPI(Routes.GET_USER_GROUP); // ✅ Proper await
  // console.log("Group data", data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Groups</h1>
          <p className="text-muted-foreground">
            Manage your shared expense groups or create a new one.
          </p>
        </div>
        <Button asChild>
          <Link href="/groups/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Group
          </Link>
        </Button>
      </div>

      <GroupList />
    </div>
  );
};

export default GroupsPage;
