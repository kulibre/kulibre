import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: () => void;
}

export function InviteMemberModal({ open, onOpenChange, onInvited }: InviteMemberModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  console.log("InviteMemberModal rendered with open state:", open);

  // Invite member mutation - modified to create a profile directly
  const inviteMemberMutation = useMutation({
    mutationFn: async () => {
      console.log("Starting member creation with values:", { email, role });
      setIsSubmitting(true);

      try {
        // Map our role values to the database role values
        let dbRole = "rider";
        switch (role) {
          case "admin":
            dbRole = "admin";
            break;
          case "manager":
          case "member":
            dbRole = "rider";
            break;
          case "viewer":
            dbRole = "client";
            break;
        }
        console.log("Mapped role:", dbRole);

        // Extract name from email (as a placeholder)
        const emailName = email.split('@')[0];
        const firstName = emailName || 'New';
        const lastName = 'Member';

        // Create team member directly
        const { data: teamMember, error: teamMemberError } = await supabase
          .from('team_members')
          .insert({
            id: uuidv4(), // Generate a new UUID for the team member
            full_name: `${firstName} ${lastName}`.trim(),
            first_name: firstName,
            last_name: lastName,
            email: email, // Store the actual email
            role: dbRole,
            active: true
          })
          .select()
          .single();

        console.log("Supabase response:", { teamMember, teamMemberError });

        if (teamMemberError) {
          console.error("Error creating team member:", teamMemberError);
          throw teamMemberError;
        }

        console.log("Team member created successfully:", teamMember);
        return teamMember;
      } catch (error) {
        console.error("Error adding member:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team member added successfully.",
      });
      setEmail("");
      setRole("member");
      onOpenChange(false);
      if (onInvited) onInvited();
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with values:", { email, role });

    // Simple validation
    if (!email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    inviteMemberMutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        console.log("Dialog open state changing to:", newOpen);
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              This email will be associated with the new team member.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={setRole}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This determines what the user can access and modify.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
