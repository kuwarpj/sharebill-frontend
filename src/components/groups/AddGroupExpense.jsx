import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";
import { showToast } from "@/lib/utils";

const AddGroupExpense = ({ groupId, groupMembers, open, onOpenChange, handleRefresh }) => {
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        participants: [],
        paidBy: "",
    });

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setFormData({
                amount: "",
                description: "",
                participants: [],
                paidBy: "",
            });
        }
    }, [open]);

    const handleSubmit = async () => {
        const { description, amount, paidBy, participants: participantIds } = formData;
        const data = await fetchAPI(
            `${Routes.ADD_EXPENSE}`,
            "POST",
            { groupId, description, amount, paidBy, participantIds }
        );
        if (data?.success === true) {
            showToast({ title: data?.message, type: "success" });
            onOpenChange(false);
            handleRefresh();
        } else {
            showToast({ title: data?.message, type: "error" });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, amount: e.target.value }))
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <Label>Participants</Label>
                        <ScrollArea className="max-h-40 rounded-md border p-2">
                            {groupMembers.map((member) => (
                                <div key={member.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`participant-${member.id}`}
                                        checked={formData.participants.includes(member.id)}
                                        onCheckedChange={(checked) => {
                                            setFormData((prev) => {
                                                const updated = checked
                                                    ? [...prev.participants, member.id]
                                                    : prev.participants.filter((id) => id !== member.id);
                                                return { ...prev, participants: updated };
                                            });
                                        }}
                                    />
                                    <label
                                        htmlFor={`participant-${member.id}`}
                                        className="text-sm font-medium"
                                    >
                                        {member.username}
                                    </label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    <div>
                        <Label>Paid By</Label>
                        <Select
                            value={formData.paidBy}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, paidBy: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payer" />
                            </SelectTrigger>
                            <SelectContent>
                                {groupMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.username}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        onClick={handleSubmit}
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddGroupExpense;
