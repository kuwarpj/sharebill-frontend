"use client";

import { useState, useEffect, useCallback, FormEvent } from "react"; // Updated import
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PlusCircle, Trash2, Users, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewGroup, clearGroupError } from "@/store/slices/groupSlice";

interface MemberEmail {
  id: string; 
  email: string;
}

export default function CreateGroupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { status, error: groupError } = useAppSelector((state) => state.groups);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [members, setMembers] = useState<MemberEmail[]>([{ id: Date.now().toString(), email: "" }]);
  const [formErrors, setFormErrors] = useState<{ groupName?: string; members?: string; general?: string }>({});

  useEffect(() => {
    dispatch(clearGroupError()); 
  }, [dispatch]);

  useEffect(() => {
    if (groupError && status === 'failed') {
      setFormErrors(prev => ({ ...prev, general: groupError }));
    }
  }, [groupError, status]);

  const handleAddMember = useCallback(() => {
    setMembers(prevMembers => [...prevMembers, { id: Date.now().toString(), email: "" }]);
  }, []);

  const handleRemoveMember = useCallback((id: string) => {
    setMembers(prevMembers => prevMembers.filter((member) => member.id !== id));
  }, []);

  const handleMemberEmailChange = useCallback((id: string, email: string) => {
    setMembers(prevMembers => prevMembers.map((member) => (member.id === id ? { ...member, email } : member)));
  }, []);

  const validateForm = useCallback(() => {
    const errors: { groupName?: string; members?: string } = {};
    if (!groupName.trim() || groupName.length < 3) {
      errors.groupName = "Group name must be at least 3 characters.";
    }
    if (groupName.length > 50) {
      errors.groupName = "Group name must be less than 50 characters.";
    }
    // No validation for groupDescription length for now, can be added if needed
    
    const validMembers = members.filter(m => m.email.trim() !== "");
    // Updated: Creator is added on backend. Frontend can allow group creation without explicitly adding other members.
    // If members are added, they must be valid emails.
    if (validMembers.length > 0) {
        validMembers.forEach(member => {
            if (!/\S+@\S+\.\S+/.test(member.email)) {
                errors.members = (errors.members ? errors.members + " " : "") + "Please provide valid email addresses for all added members.";
            }
        });
    }
    // If only one member input field is present and it's empty, it's fine (creator only group)
    // If multiple member input fields are present, and some are empty, that's also fine - they'll be ignored.

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [groupName, members]); // Removed groupDescription from deps as it's optional and not strictly validated here.

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearGroupError());
    setFormErrors({});

    if (!validateForm()) {
      return;
    }
    
    const memberEmailsForApi = members.filter(m => m.email.trim() !== "").map(m => ({ email: m.email }));

    try {
      const resultAction = await dispatch(createNewGroup({ 
        groupName, 
        groupDescription, 
        members: memberEmailsForApi, // Backend adds creator automatically
      }));

      if (createNewGroup.fulfilled.match(resultAction)) {
        toast({
          title: "Group Created!",
          description: `The group "${resultAction.payload.name}" has been successfully created.`,
        });
        router.push(`/groups/${resultAction.payload.id}`); 
      } else if (createNewGroup.rejected.match(resultAction)) {
         setFormErrors({ general: resultAction.payload as string || "Failed to create group." });
      }
    } catch (err: any) {
      setFormErrors({ general: err.message || "An unexpected error occurred."});
    }
  }, [dispatch, groupName, groupDescription, members, toast, router, validateForm]);
  
  const isLoading = status === 'loading';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to groups</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Group</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Group Details</CardTitle>
          </div>
          <CardDescription>
            Set up your new group. You will be added as a member automatically. Add other members by email.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="e.g., Goa Trip, Apartment Bills"
                disabled={isLoading}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              {formErrors.groupName && (
                <p className="text-sm text-destructive">{formErrors.groupName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="groupDescription">Group Description (Optional)</Label>
              <Textarea
                id="groupDescription"
                placeholder="e.g., Expenses for our awesome vacation!"
                disabled={isLoading}
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block">Add Members (Optional)</Label>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-2">
                     <UserPlus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <Input
                      placeholder={`Member ${index + 1} email (optional)`}
                      disabled={isLoading}
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberEmailChange(member.id, e.target.value)}
                      className="flex-grow"
                    />
                    {/* Allow removing even the first input if user decides not to add anyone initially */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={isLoading}
                      aria-label="Remove member"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {formErrors.members && (
                   <p className="text-sm text-destructive ml-7">{formErrors.members}</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMember}
                  disabled={isLoading}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Another Member
                </Button>
              </div>
            </div>
            {formErrors.general && (
                <p className="text-sm text-destructive text-center">{formErrors.general}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Create Group
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
