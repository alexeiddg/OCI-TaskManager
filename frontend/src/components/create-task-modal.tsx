"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateTaskSchema } from "@/lib/types/DTO/setup/TaskCreationSchema";
import { TaskPriority } from "@/lib/types/enums/TaskPriority";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";
import { TaskType } from "@/lib/types/enums/TaskType";
import type { CreateTaskFormValues } from "@/lib/types/DTO/setup/TaskCreationSchema";
import { createTaskRequest } from "@/server/api/task/createTask";
import { toast } from "sonner";
import type { Session } from "next-auth";

interface User {
  id: number;
  name: string;
}

interface Sprint {
  id: number;
  sprintName: string;
}

interface TaskAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprints: Sprint[];
  users: User[];
  currentUser: User;
  defaultSprintId?: number;
  session?: Session;
}

export function TaskAddModal({
  open,
  onOpenChange,
  sprints,
  users,
  currentUser,
  defaultSprintId,
  session,
}: TaskAddModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const calendarRef = useRef(null);

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
      taskPriority: TaskPriority.MEDIUM,
      taskStatus: TaskStatus.TODO,
      taskType: TaskType.FEATURE,
      storyPoints: 1,
      sprint: defaultSprintId || 0,
      dueDate: "",
      createdBy: currentUser?.id || 0,
      assignedTo: currentUser?.id || 0,
      isFavorite: false,
    },
  });

  const handleFormSubmit = async (data: CreateTaskFormValues) => {
    setIsSubmitting(true);
    try {
      await createTaskRequest(data);
      toast.success("Task created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom handler to prevent dialog close when interacting with popover content
  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen && isDatePickerOpen) {
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          // Prevent closing if click originated in date picker
          if (isDatePickerOpen) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for your sprint.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Task Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description field */}
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid for Priority and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taskPriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Priority <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                        <SelectItem value={TaskPriority.MEDIUM}>
                          Medium
                        </SelectItem>
                        <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taskStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Grid for Type and Story Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taskType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TaskType.FEATURE}>
                          Feature
                        </SelectItem>
                        <SelectItem value={TaskType.BUG}>Bug</SelectItem>
                        <SelectItem value={TaskType.IMPROVEMENT}>
                          Improvement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storyPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Story Points <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(Number.parseInt(value))
                      }
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select points" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 Point</SelectItem>
                        <SelectItem value="2">2 Points</SelectItem>
                        <SelectItem value="3">3 Points</SelectItem>
                        <SelectItem value="4">4 Points</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Complexity estimate (1-4)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Grid for Sprint and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sprint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sprint <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(Number.parseInt(value))
                      }
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sprint" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sprints.map((sprint) => (
                          <SelectItem
                            key={sprint.id}
                            value={sprint.id.toString()}
                          >
                            {sprint.sprintName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Due Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover
                      open={isDatePickerOpen}
                      onOpenChange={setIsDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        ref={calendarRef}
                        className="w-auto p-0 pointer-events-auto"
                        align="start"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="calendar-wrapper pointer-events-auto"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : "");
                              setTimeout(() => {
                                setIsDatePickerOpen(false);
                              }, 100);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Assignee section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {session?.user?.role === "MANAGER" ? (
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Assigned To <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => {
                    if (field.value !== currentUser.id) {
                      field.onChange(currentUser.id);
                    }
                    return <input type="hidden" {...field} />;
                  }}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
