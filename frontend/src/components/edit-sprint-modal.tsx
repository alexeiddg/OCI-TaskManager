"use client";

import type * as React from "react";
import { useState, useEffect } from "react";
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SprintStatus } from "@/lib/types/enums/SprintStatus";

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface Sprint {
  id: number;
  sprintName: string;
  sprintDescription: string;
  startDate: Date | string;
  endDate: Date | string;
  status: SprintStatus;
  project: Project;
  tasks: Task[];
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface SprintEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprint?: Sprint | null;
  projects: Project[];
  onSave: (sprint: Sprint) => Promise<void>;
}

export function SprintEditModal({
  open,
  onOpenChange,
  sprint,
  projects,
  onSave,
}: SprintEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Sprint>>({
    sprintName: "",
    sprintDescription: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: SprintStatus.PLANNING,
    isActive: true,
    tasks: [],
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  useEffect(() => {
    if (sprint) {
      setFormData({
        ...sprint,
        startDate: sprint.startDate ? new Date(sprint.startDate) : new Date(),
        endDate: sprint.endDate
          ? new Date(sprint.endDate)
          : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
    } else {
      // Reset form for new sprint
      setFormData({
        sprintName: "",
        sprintDescription: "",
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: SprintStatus.PLANNING,
        isActive: true,
        tasks: [],
      });
    }
  }, [sprint, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as SprintStatus }));
  };

  const handleProjectChange = (projectId: number) => {
    const selectedProject = projects.find((p) => p.id === projectId);
    if (selectedProject) {
      setFormData((prev) => ({ ...prev, project: selectedProject }));
    }
    setProjectOpen(false);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, startDate: date }));
      setStartDateOpen(false);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, endDate: date }));
      setEndDateOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sprintName || !formData.project) {
      // Show validation error
      return;
    }

    setIsLoading(true);

    try {
      await onSave(formData as Sprint);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save sprint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setStartDateOpen(false);
      setEndDateOpen(false);
      setProjectOpen(false);
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenState) => {
        if (!newOpenState) {
          setStartDateOpen(false);
          setEndDateOpen(false);
          setProjectOpen(false);
        }
        onOpenChange(newOpenState);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {sprint ? "Edit Sprint" : "Create New Sprint"}
            </DialogTitle>
            <DialogDescription>
              {sprint
                ? "Update the details of your sprint."
                : "Fill in the details to create a new sprint."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprintName" className="text-right">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sprintName"
                name="sprintName"
                value={formData.sprintName || ""}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project <span className="text-destructive">*</span>
              </Label>
              <div className="col-span-3">
                <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={projectOpen}
                      className="w-full justify-between"
                    >
                      {formData.project?.name || "Select project..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search projects..." />
                      <CommandList>
                        <CommandEmpty>No project found.</CommandEmpty>
                        <CommandGroup>
                          {projects.map((project) => (
                            <CommandItem
                              key={project.id}
                              value={project.name}
                              onSelect={() => handleProjectChange(project.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.project?.id === project.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {project.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="sprintDescription" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="sprintDescription"
                name="sprintDescription"
                value={formData.sprintDescription || ""}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <div className="col-span-3">
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(new Date(formData.startDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.startDate
                          ? new Date(formData.startDate)
                          : undefined
                      }
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date <span className="text-destructive">*</span>
              </Label>
              <div className="col-span-3">
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(new Date(formData.endDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.endDate
                          ? new Date(formData.endDate)
                          : undefined
                      }
                      onSelect={handleEndDateChange}
                      initialFocus
                      disabled={(date) =>
                        formData.startDate
                          ? date < new Date(formData.startDate)
                          : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SprintStatus.PLANNING}>
                    Planning
                  </SelectItem>
                  <SelectItem value={SprintStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={SprintStatus.COMPLETED}>
                    Completed
                  </SelectItem>
                  <SelectItem value={SprintStatus.CANCELLED}>
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange}
                />
                <Label
                  htmlFor="isActive"
                  className="text-sm text-muted-foreground"
                >
                  {formData.isActive
                    ? "Sprint is active"
                    : "Sprint is inactive"}
                </Label>
              </div>
            </div>

            {sprint && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-muted-foreground">
                    Created
                  </Label>
                  <span className="col-span-3 text-sm text-muted-foreground">
                    {sprint.createdAt
                      ? format(new Date(sprint.createdAt), "PPP 'at' p")
                      : "N/A"}
                  </span>
                </div>

                {sprint.updatedAt && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">
                      Last Updated
                    </Label>
                    <span className="col-span-3 text-sm text-muted-foreground">
                      {format(new Date(sprint.updatedAt), "PPP 'at' p")}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-muted-foreground">
                    Tasks
                  </Label>
                  <span className="col-span-3 text-sm text-muted-foreground">
                    {sprint.tasks?.length || 0} tasks associated
                  </span>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sprint ? "Update Sprint" : "Create Sprint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
