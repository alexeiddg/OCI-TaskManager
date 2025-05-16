"use client";

import type * as React from "react";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Check, Loader2, Mail, } from "lucide-react";
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
import {IconMail} from "@tabler/icons-react";

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
      console.log(response);
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
          <Button
              variant="default"
              className="h-8 w-8 p-0 flex items-center justify-center rounded-md bg-secondary"
              aria-label="Invite Team Member"
          >
            <IconMail className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new member to your team.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      className={error ? "border-destructive pr-10" : "pr-10"}
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

            <DialogFooter className="pt-2">
              <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                  type="submit"
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
