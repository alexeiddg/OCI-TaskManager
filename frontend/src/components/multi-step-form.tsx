"use client";

import { submitSetupForm } from "@/server/helpers/setup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TeamCreationFormValues } from "@/lib/types/DTO/setup/teamCreationForm";
import { useRouter } from "next/navigation";
import { SprintStatus } from "@/lib/types/enums/SprintStatus";
import { Textarea } from "@/components/ui/textarea";

const TOTAL_STEPS = 3;

const stepLabels = [
  {
    title: "Create your Team",
    subtitle: "Build your squad and assign a leader.",
  },
  {
    title: "Create a Project",
    subtitle: "Give your initiative a name and purpose.",
  },
  {
    title: "Create a Sprint",
    subtitle: "Set up your first milestone with dates.",
  },
];

export function MultiStepForm() {
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const form = useForm<TeamCreationFormValues>({
    defaultValues: {
      teamName: "",
      managerId: "",
      projectName: "",
      projectDescription: "",
      sprintName: "",
      startDate: "",
      endDate: "",
      sprintDescription: "",
      sprintStatus: SprintStatus.ACTIVE,
    },
  });

  const handleAddEmail = () => {
    if (inviteEmail && !invitedEmails.includes(inviteEmail)) {
      setInvitedEmails([...invitedEmails, inviteEmail]);
      setInviteEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInvitedEmails((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = async (data: TeamCreationFormValues) => {
    if (step < TOTAL_STEPS - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    const request = {
      teamName: data.teamName,
      project: {
        name: data.projectName,
        description: data.projectDescription,
      },
      sprint: {
        name: data.sprintName,
        startDate: `${data.startDate}T00:00:00`,
        endDate: `${data.endDate}T00:00:00`,
        sprintDescription: data.sprintDescription,
        sprintStatus: data.sprintStatus,
      },
    };

    try {
      await submitSetupForm(request);
      toast.success("Setup completed successfully!");
    } catch (error) {
      toast.error("Failed to complete setup. Please try again.");
      console.error(error);
    } finally {
      toast.message("Re-authentication required. Redirecting...");
      setTimeout(() => router.replace("/sign-out"), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-7xl bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden border border-border">
        {/* Sidebar Stepper */}
        <div className="hidden sm:block sm:w-1/4 border-r border-border h-[800px] overflow-y-auto bg-sidebar text-sidebar-foreground">
          <div className="px-6 py-8 flex flex-col h-full">
            <h2 className="font-semibold text-lg">
              Let&#39;s get you started!
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Follow these steps to structure your workspace.
            </p>
            <div className="space-y-6 flex-grow">
              {stepLabels.map((stepItem, index) => (
                <div key={index} className="relative pl-6">
                  <div className="absolute left-0 top-0 flex flex-col items-center">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2",
                        index === step
                          ? "bg-sidebar-primary border-sidebar-primary"
                          : index < step
                            ? "bg-sidebar-primary/90 border-sidebar-primary"
                            : "bg-sidebar-accent border-sidebar-border",
                      )}
                    />
                    {index < TOTAL_STEPS - 1 && (
                      <div className="w-px h-12 bg-sidebar-border mt-1" />
                    )}
                  </div>
                  <div className="ml-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        index === step
                          ? "text-sidebar-primary"
                          : index < step
                            ? "text-sidebar-foreground/70"
                            : "text-sidebar-foreground/50",
                      )}
                    >
                      {stepItem.title}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60">
                      {stepItem.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="w-full sm:w-3/4 px-6 sm:px-10 py-8 flex flex-col h-[800px] overflow-y-auto">
          <div className="block sm:hidden mb-6">
            <h2 className="font-semibold text-lg mb-2">
              Step {step + 1} of {TOTAL_STEPS}
            </h2>
            <p className="text-sm text-muted-foreground">
              {stepLabels[step].title}: {stepLabels[step].subtitle}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full"
            >
              <div className="space-y-4 mb-4">
                {step === 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">
                      {stepLabels[0].title}
                    </h3>
                    <FormField
                      control={form.control}
                      name="teamName"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Dream Team Alpha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Invite Developers by Email</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="developer@email.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddEmail}>
                          Invite
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {invitedEmails.map((email) => (
                          <span
                            key={email}
                            className="bg-muted text-sm px-3 py-1 pr-2 rounded-full border border-border flex items-center gap-2"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(email)}
                            >
                              <X className="w-4 h-4 hover:text-red-500 transition" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </FormItem>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">
                      {stepLabels[1].title}
                    </h3>
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Inventory Optimization Tool"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe your project goals..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">
                      {stepLabels[2].title}
                    </h3>
                    <FormField
                      control={form.control}
                      name="sprintName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sprint Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Sprint 1: Initial Release"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="sprintDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sprint Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the sprint's focus, backlog, and goals..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sprintStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sprint Status</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              readOnly
                              className="bg-muted text-muted-foreground cursor-not-allowed"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 0}
                  >
                    Prev
                  </Button>
                  <Button type="submit" variant="default">
                    {step === TOTAL_STEPS - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
