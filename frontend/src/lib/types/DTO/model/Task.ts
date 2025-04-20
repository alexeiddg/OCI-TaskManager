import { z } from "zod";
import { TaskPriority } from "@/lib/types/enums/TaskPriority";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";
import { TaskType } from "@/lib/types/enums/TaskType";

export const Task = z.object({
  id: z.number(),
  sprintId: z.number(),
  sprintName: z.string(),
  taskName: z.string(),
  taskDescription: z.string(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  type: z.nativeEnum(TaskType),
  storyPoints: z.number(),
  dueDate: z.string(),
  completedAt: z.string().nullable(),
  createdById: z.number().nullable(),
  createdByUsername: z.string().nullable(),
  assignedToUsername: z.string().nullable(),
  blocked: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  completed: z.boolean(),
  favorite: z.boolean().nullable(),
});

export type TaskModel = z.infer<typeof Task>;
