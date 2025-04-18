import { z } from "zod";
import { TaskPriority } from "@/lib/types/enums/TaskPriority";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";
import { TaskType } from "@/lib/types/enums/TaskType";

export const CreateTaskSchema = z.object({
    taskName: z.string(),
    taskDescription: z.string(),
    taskPriority: z.nativeEnum(TaskPriority),
    taskStatus: z.nativeEnum(TaskStatus),
    taskType: z.nativeEnum(TaskType),
    storyPoints: z.number().min(1).max(4),
    sprint: z.number(),
    dueDate: z.string(),
    createdBy: z.string(),
    assignedTo: z.string(),
    isFavorite: z.boolean(),
});

export type CreateTaskFormValues = z.infer<typeof CreateTaskSchema>;
