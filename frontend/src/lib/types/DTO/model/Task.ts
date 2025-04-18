import { z } from "zod";
import { TaskPriority } from "@/lib/types/enums/TaskPriority";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";
import { TaskType } from "@/lib/types/enums/TaskType";

export const Task = z.object({
  id: z.number(),
  sprint: z.number(),
  taskName: z.string(),
  taskDescription: z.string(),
  taskPriority: z.nativeEnum(TaskPriority),
  taskStatus: z.nativeEnum(TaskStatus),
  taskType: z.nativeEnum(TaskType),
  storyPoints: z.number(),
  dueDate: z.string(),
  completedAt: z.string(),
  createdBy: z.string(),
  assignedTo: z.string(),
  blocked: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
