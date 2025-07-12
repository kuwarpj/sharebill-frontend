"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Trash2, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";

interface Member {
  id: string;
  email: string;
}

export default function CreateGroupForm() {
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    members: [{ id: Date.now().toString(), email: "" }] as Member[],
  });

  const handleAddMember = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, { id: Date.now().toString(), email: "" }],
    }));
  }, []);

  const handleRemoveMember = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  }, []);

  const handleMemberChange = useCallback((id: string, email: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, email } : m)),
    }));
  }, []);

  const handleInputChange = useCallback(
    (field: "groupName" | "groupDescription", value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCreateGroup = useCallback(() => {
    const payload = {
      groupName: formData.groupName,
      groupDescription: formData.groupDescription,
      members: formData.members.filter((m) => m.email.trim() !== ""),
    };
    try {
      const data = fetchAPI(Routes.CREATE_GROUP, "POST", payload);

      console.log("This is Data", data);
    } catch (error) {}
  }, [formData]);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to groups</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Group</h1>
      </div>

      {/* Group Card */}
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Group Details</CardTitle>
          </div>
          <CardDescription>
            Set up your new group. You will be added as a member automatically.
            Add other members by email. If they don&apos;t have an account,
            they&apos;ll receive an invitation to join.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="e.g., Goa Trip, Apartment Bills"
              value={formData.groupName}
              onChange={(e) => handleInputChange("groupName", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="groupDescription">
              Group Description (Optional)
            </Label>
            <Textarea
              id="groupDescription"
              placeholder="e.g., Expenses for our awesome vacation!"
              value={formData.groupDescription}
              onChange={(e) =>
                handleInputChange("groupDescription", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-2 block">
              Add Members by Email (Optional)
            </Label>
            <div className="space-y-3">
              {formData.members.map((member, index) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder={`Member ${index + 1} email`}
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      handleMemberChange(member.id, e.target.value)
                    }
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    aria-label="Remove member"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMember}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add Another Member
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleCreateGroup} className="w-full">
            Create Group
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
