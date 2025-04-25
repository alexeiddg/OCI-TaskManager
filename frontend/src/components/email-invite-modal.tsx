"use client";

import type * as React from "react";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Check, Loader2, Mail, UserPlus } from "lucide-react";
import { inviteUserToTeam } from "@/server/api/email/inviteUser";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Email validation schema
const emailSchema = z.string().email("Please enter a valid email address");

export type InviteTeamMemberModalHandle = {
  openModal: () => void;
};

type InviteTeamMemberModalProps = {
  teamId: number;
};

export const InviteTeamMemberModal = forwardRef<
  InviteTeamMemberModalHandle,
  InviteTeamMemberModalProps
>(({ teamId }, ref) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  useEffect(() => {
    if (open) {
      setEmail("");
      setError(null);
      setIsSuccess(false);
    }
  }, [open]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Please enter a valid email address");
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      setError("Invalid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await inviteUserToTeam(teamId, email);
      console.log(response); // You can log the response or use it for other purposes
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to send invite:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="h-6 w-full text-sm py-1">
          <UserPlus className="h-4 w-full" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-full text-sm p-2 bg-muted">
        <DialogHeader className="p-2 bg-muted">
          <DialogTitle className="text-sm">Invite Member</DialogTitle>
          <DialogDescription className="text-xs">
            Send an invitation email to add a new member to your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-1 py-1">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-left text-sm">
                Email address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={
                    error
                      ? "border-destructive pr-10 text-sm h-6"
                      : "pr-10 text-sm h-6"
                  }
                  disabled={isLoading || isSuccess}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {isSuccess ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter className="p-2 space-x-2">
            <Button
              type="button"
              className="text-sm h-6 px-2"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-sm h-6 px-2"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Sent!
                </>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

InviteTeamMemberModal.displayName = "InviteTeamMemberModal";
