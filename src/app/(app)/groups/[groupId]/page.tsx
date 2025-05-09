"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback, FormEvent } from "react"; // Updated import
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PlusCircle, Users, FileText, Edit3, Settings, UserPlus, ListFilter, DollarSign } from "lucide-react";
import type { UserProfile } from "@/types"; 
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroupById, clearGroupError, setCurrentGroup } from "@/store/slices/groupSlice";
import { fetchExpensesByGroupId, addNewExpense, clearExpenseError, clearExpenses } from "@/store/slices/expenseSlice";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const groupId = params.groupId as string;

  const { currentGroup, status: groupStatus, error: groupError } = useAppSelector((state) => state.groups);
  const { expenses, status: expenseStatus, error: expenseError } = useAppSelector((state) => state.expenses);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidById, setPaidById] = useState<string | undefined>(undefined);
  const [expenseCategory, setExpenseCategory] = useState("General");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
      dispatch(fetchExpensesByGroupId(groupId));
    }
    return () => { 
        dispatch(setCurrentGroup(null));
        dispatch(clearExpenses());
        dispatch(clearGroupError());
        dispatch(clearExpenseError());
    }
  }, [groupId, dispatch]);

  useEffect(() => {
     if (groupError) {
        toast({ title: "Error fetching group", description: groupError, variant: "destructive" });
        dispatch(clearGroupError());
     }
     if (expenseError) {
        toast({ title: "Error fetching expenses", description: expenseError, variant: "destructive" });
        dispatch(clearExpenseError());
     }
  }, [groupError, expenseError, dispatch, toast]);

  useEffect(() => {
    if (currentGroup && currentUser) {
      const isCurrentUserMember = currentGroup.members.some(member => member.id === currentUser.id);
      if (isCurrentUserMember) {
        setPaidById(currentUser.id);
      } else if (currentGroup.members.length > 0) {
        setPaidById(currentGroup.members[0].id);
      }
      setSelectedParticipantIds(currentGroup.members.map(m => m.id));
    } else if (currentGroup && currentGroup.members.length > 0) {
        setPaidById(currentGroup.members[0].id);
        setSelectedParticipantIds(currentGroup.members.map(m => m.id));
    }
  }, [currentGroup, currentUser]);

  const handleParticipantSelection = useCallback((memberId: string) => {
    setSelectedParticipantIds(prev => 
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  }, []);


  const handleAddExpense = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!currentGroup || !paidById) return;

    const amountNum = parseFloat(expenseAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }
    if (!expenseDescription.trim()) {
      toast({ title: "Invalid Description", description: "Please enter a description for the expense.", variant: "destructive" });
      return;
    }
    if (selectedParticipantIds.length === 0) {
      toast({ title: "No Participants", description: "Please select at least one participant for the expense.", variant: "destructive" });
      return;
    }
    
    try {
      const resultAction = await dispatch(addNewExpense({
        groupId: currentGroup.id,
        description: expenseDescription,
        amount: amountNum,
        paidById,
        category: expenseCategory,
        participantIds: selectedParticipantIds,
      }));

      console.log("This is Result Actions", resultAction)

      if (addNewExpense.fulfilled.match(resultAction)) {
        toast({ title: "Expense Added", description: `${resultAction.payload.description} of $${resultAction.payload.amount.toFixed(2)} added.` });
        setIsAddExpenseOpen(false);
        setExpenseDescription("");
        setExpenseAmount("");
        setExpenseCategory("General");
        if (currentGroup) { 
             setSelectedParticipantIds(currentGroup.members.map(m => m.id));
        }
      } else if (addNewExpense.rejected.match(resultAction)) {
         toast({ title: "Failed to Add Expense", description: resultAction.payload as string, variant: "destructive"});
      }
    } catch (err: any) {
       toast({ title: "Error Adding Expense", description: err.message || "An unexpected error occurred.", variant: "destructive"});
    }
  }, [dispatch, currentGroup, paidById, expenseDescription, expenseAmount, expenseCategory, selectedParticipantIds, toast, setIsAddExpenseOpen, setExpenseDescription, setExpenseAmount, setExpenseCategory, setSelectedParticipantIds]);

  const isLoading = groupStatus === 'loading' || expenseStatus === 'loading';

  if (isLoading && !currentGroup) { 
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!currentGroup && groupStatus === 'failed') {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Group not found</h2>
        <p className="text-muted-foreground">{groupError || "The group you are looking for does not exist or you do not have access."}</p>
        <Button asChild className="mt-4">
          <Link href="/groups">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Groups
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!currentGroup) { 
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  let yourBalance = 0;
  if (currentUser) {
    expenses.forEach(expense => {
      const userIsParticipant = expense.participants.some(p => p.id === currentUser.id);
      if (userIsParticipant) {
        const share = expense.amount / expense.participants.length;
        if (expense.paidBy.id === currentUser.id) {
          yourBalance += expense.amount - share; 
        } else {
          yourBalance -= share; 
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to groups</span>
          </Link>
        </Button>
        <div className="flex-grow flex items-center gap-3">
            {currentGroup.iconUrl && (
                <Image 
                src={currentGroup.iconUrl} 
                alt={`${currentGroup.name} icon`} 
                width={40} 
                height={40} 
                className="rounded-lg object-cover"
                data-ai-hint="group abstract" 
                />
            )}
            {!currentGroup.iconUrl && (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
            <h1 className="text-3xl font-bold tracking-tight">{currentGroup.name}</h1>
        </div>
        <DropdownMenuForGroupActions />
      </div>
      <p className="text-muted-foreground">{currentGroup.description}</p>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent in Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${yourBalance < 0 ? 'text-destructive' : yourBalance > 0 ? 'text-green-600' : ''}`}>
              ${Math.abs(yourBalance).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {yourBalance < 0 ? "You owe" : yourBalance > 0 ? "You are owed" : "Settled up"}
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {currentGroup.members.map(member => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background" title={member.username}>
                <AvatarImage src={member.avatarUrl || `https://picsum.photos/seed/${member.username}/40/40`} alt={member.username} data-ai-hint="person avatar" />
                <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Expenses {expenseStatus === 'loading' && <span className="text-sm text-muted-foreground ml-2">loading...</span>}</h2>
        <div className="flex gap-2">
            <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filter</Button>
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Expense</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Enter details and select participants. Split is equal among selected members.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddExpense} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="exp-description" className="text-right">Description</Label>
                    <Input id="exp-description" value={expenseDescription} onChange={e => setExpenseDescription(e.target.value)} placeholder="e.g., Dinner, Groceries" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="exp-amount" className="text-right">Amount ($)</Label>
                    <Input id="exp-amount" type="number" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="0.00" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="exp-paidby" className="text-right">Paid by</Label>
                    <Select value={paidById} onValueChange={setPaidById}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select who paid" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentGroup.members.map(member => (
                          <SelectItem key={member.id} value={member.id}>{member.username}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="exp-category" className="text-right">Category</Label>
                     <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Household">Household</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Split Among</Label>
                    <ScrollArea className="col-span-3 h-32 rounded-md border p-2">
                      <div className="space-y-2">
                        {currentGroup.members.map(member => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`participant-${member.id}`}
                              checked={selectedParticipantIds.includes(member.id)}
                              onCheckedChange={() => handleParticipantSelection(member.id)}
                            />
                            <Label htmlFor={`participant-${member.id}`} className="font-normal flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={member.avatarUrl || `https://picsum.photos/seed/${member.username}/20/20`} alt={member.username} data-ai-hint="person avatar" />
                                <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              {member.username}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={expenseStatus === 'loading'}>
                        {expenseStatus === 'loading' && (
                             <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Add Expense
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description} <Badge variant="outline" className="ml-2 capitalize">{expense.category || "General"}</Badge></TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={expense.paidBy.avatarUrl || `https://picsum.photos/seed/${expense.paidBy.username}/40/40`} alt={expense.paidBy.username} data-ai-hint="person avatar" />
                            <AvatarFallback>{expense.paidBy.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {expense.paidBy.username}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {expense.participants.map(p => (
                            <Avatar key={p.id} className="h-6 w-6 border" title={p.username}>
                                <AvatarImage src={p.avatarUrl || `https://picsum.photos/seed/${p.username}/24/24`} alt={p.username} data-ai-hint="person avatar"/>
                                <AvatarFallback>{p.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        ))}
                        {expense.participants.length === 0 && <span className="text-xs text-muted-foreground">All</span>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /> <span className="sr-only">Edit</span></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        expenseStatus !== 'loading' && ( 
            <Card>
            <CardContent className="p-10 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Expenses Yet</h3>
                <p className="text-muted-foreground mt-2">
                Add the first expense to this group to start tracking.
                </p>
                <Button onClick={() => setIsAddExpenseOpen(true)} className="mt-6">
                <PlusCircle className="mr-2 h-5 w-5" /> Add First Expense
                </Button>
            </CardContent>
            </Card>
        )
      )}

      <Card>
        <CardHeader>
          <CardTitle>Settlement Summary</CardTitle>
          <CardDescription>Who owes whom in this group. (Simplified view, detailed calculations needed for complex splits)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Advanced settlement calculations based on custom splits will be implemented later.</p>
          <Button className="mt-4" disabled><DollarSign className="mr-2 h-4 w-4" /> Settle Up Manually (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Dropdown menu for group actions (placeholder)
function DropdownMenuForGroupActions() {
  // TODO: Implement functionality for these actions
  return (
    <Dialog> 
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Group Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Button variant="outline" className="w-full justify-start" disabled><Edit3 className="mr-2 h-4 w-4" /> Edit Group Details</Button>
          <Button variant="outline" className="w-full justify-start" disabled><UserPlus className="mr-2 h-4 w-4" /> Add/Remove Members</Button>
          <Button variant="destructive" className="w-full justify-start" disabled>Leave Group</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
