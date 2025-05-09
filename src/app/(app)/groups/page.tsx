"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users, Eye, ChevronRight, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroups, clearGroupError } from "@/store/slices/groupSlice";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state


export default function GroupsPage() {
  const dispatch = useAppDispatch();
  const { groups, status, error } = useAppSelector((state) => state.groups);

  useEffect(() => {
    // Fetch groups only if they haven't been fetched or status is idle/failed
    if (status === 'idle' || (status === 'failed' && !groups.length)) {
      dispatch(fetchGroups());
    }
    // Cleanup error on unmount
    return () => {
      dispatch(clearGroupError());
    }
  }, [dispatch, status, groups.length]);

  if (status === 'loading' && !groups.length) { // Show skeleton only on initial load
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader><Skeleton className="h-24 w-full" /></CardHeader>
              <CardContent><Skeleton className="h-10 w-3/4" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'failed' && !groups.length) {
    return (
      <div className="space-y-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-semibold">Failed to load groups</h1>
        <p className="text-muted-foreground">{error || "An unexpected error occurred."}</p>
        <Button onClick={() => dispatch(fetchGroups())}>Try Again</Button>
      </div>
    );
  }

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

      {groups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center gap-4">
                  {group.iconUrl && (
                    <Image 
                      src={group.iconUrl} 
                      alt={`${group.name} icon`} 
                      width={64} 
                      height={64} 
                      className="rounded-lg object-cover"
                      data-ai-hint="group abstract" 
                    />
                  )}
                   {!group.iconUrl && (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{group.description || "No description"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                  <p>Members: {group.members.length}</p>
                  <p>Created: {new Date(group.createdAt).toLocaleDateString()}</p>
                  {typeof group.currentUserBalance === 'number' && (
                     <p className={`mt-2 font-semibold ${group.currentUserBalance < 0 ? 'text-destructive' : group.currentUserBalance > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      Your Balance: ${Math.abs(group.currentUserBalance).toFixed(2)}
                      {group.currentUserBalance < 0 ? " (Owed)" : group.currentUserBalance > 0 ? " (Owed to you)" : " (Settled)"}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-shrink-0 border-t pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/groups/${group.id}`} className="flex items-center justify-center">
                    <Eye className="mr-2 h-4 w-4" /> View Group <ChevronRight className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        status === 'succeeded' && groups.length === 0 && ( // Only show "No Groups Yet" if fetch succeeded and no groups
          <Card>
            <CardContent className="p-10 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Groups Yet</h3>
              <p className="text-muted-foreground mt-2">
                Create a new group to start sharing expenses with your friends or colleagues.
              </p>
              <Button asChild className="mt-6">
                <Link href="/groups/create">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create First Group
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
