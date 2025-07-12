// WIP: Refactoring to remove redux and use fetch API instead
// All redux-related logic like useAppSelector, useAppDispatch, fetchGroupById, etc., removed
// Focusing only on fetching and displaying expenses based on provided API response

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Users, ArrowLeft } from "lucide-react";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";

export default function GroupDetailPage() {
  const { groupId } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGroupData() {
      try {
        setLoading(true);
        const data = await fetchAPI(
          `${Routes.GET_GROUP_EXPENSE}/${groupId}`,
          "GET"
        );

        if (data?.success === true) {
          setExpenses(data?.data);
        }
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (groupId) fetchGroupData();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild className="mt-4">
          <Link href="/groups">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Groups
          </Link>
        </Button>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to groups</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Group Expenses</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Spent in Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
        </CardContent>
      </Card>

      {expenses.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense: any) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.description}{" "}
                    {/* <Badge variant="outline" className="ml-2 capitalize">
                      {expense.category || "General"}
                    </Badge> */}
                  </TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={expense.paidBy.avatarUrl}
                          alt={expense.paidBy.username}
                        />
                        <AvatarFallback>
                          {expense.paidBy.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {expense.paidBy.username}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {expense.participants.map((p) => (
                        <Avatar
                          key={p.id}
                          className="h-6 w-6 border"
                          title={p.username}
                        >
                          <AvatarImage src={p.avatarUrl} alt={p.username} />
                          <AvatarFallback>
                            {p.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Expenses Yet</h3>
            <p className="text-muted-foreground mt-2">
              Add the first expense to this group to start tracking.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
