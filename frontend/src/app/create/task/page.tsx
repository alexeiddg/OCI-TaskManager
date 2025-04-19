"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CreateTaskSchema,
  type CreateTaskFormValues,
} from "@/lib/types/DTO/setup/TaskCreationSchema";
import { TaskType } from "@/lib/types/enums/TaskType";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchTaskDeps } from "@/server/api/task/createTaskHelpers";
import type { AppUserDto } from "@/lib/types/DTO/model/AppUserDto";
import type { SprintDto } from "@/lib/types/DTO/model/SprintDto";
import { TaskPriority } from "@/lib/types/enums/TaskPriority";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";
import { useRouter } from "next/navigation";
import { createTaskRequest } from "@/server/api/task/createTask";
import { toast } from "sonner";

export default function CreateTaskPage() {
  const router = useRouter();
  const [members, setMembers] = useState<AppUserDto[]>([]);
  const [sprints, setSprints] = useState<SprintDto[]>([]);
  const { data: session } = useSession();
  const teamId = session?.user?.teamId?.toString() ?? "";

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
      taskPriority: TaskPriority.MEDIUM,
      taskStatus: TaskStatus.TODO,
      taskType: TaskType.FEATURE,
      storyPoints: 1,
      sprint: undefined,
      dueDate: "",
      createdBy: "",
      assignedTo: "",
      isFavorite: false,
    },
  });

  useEffect(() => {
    if (!teamId) return;
    fetchTaskDeps(teamId)
      .then(({ members, sprints }) => {
        setMembers(members);
        setSprints(sprints);
      })
      .catch(console.error);
  }, [teamId]);

  const onSubmit = async (values: CreateTaskFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a task.");
      return;
    }

    try {
      const payload = {
        ...values,
        sprint: Number(values.sprint),
        dueDate: new Date(values.dueDate).toISOString(),
        createdBy: session.user.id,
        isFavorite: values.isFavorite ?? false,
      };

      await createTaskRequest(payload);
      toast.success("Task created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while creating the task.");
    }
  };

  const priorities = Object.values(TaskPriority);
  const statuses = Object.values(TaskStatus);
  const types = Object.values(TaskType);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/redwood-background.jpg')" }}
    >
      <div className="w-full max-w-4xl bg-card border rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-6">Create New Task</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Task Name */}
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Task Description */}
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="taskPriority"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="taskStatus"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="taskType"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sprint */}
            <FormField
              control={form.control}
              name="sprint"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Sprint</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select sprint…" />
                      </SelectTrigger>
                      <SelectContent>
                        {sprints.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.sprintName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assigned To */}
            {session?.user?.role === "MANAGER" && (
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Assign user…" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((m) => (
                            <SelectItem key={m.id} value={m.id.toString()}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Story Points */}
            <FormField
              control={form.control}
              name="storyPoints"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Story Points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="w-full"
                      min={1}
                      max={4}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="col-span-full flex justify-end mt-4">
              <Button type="submit" className="w-full md:w-auto">
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
