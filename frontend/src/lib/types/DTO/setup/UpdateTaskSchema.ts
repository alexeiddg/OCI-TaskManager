import { z } from "zod"
import { TaskPriority } from "@/lib/types/enums/TaskPriority"
import { TaskStatus }   from "@/lib/types/enums/TaskStatus"
import { TaskType }     from "@/lib/types/enums/TaskType"

export const UpdateTaskSchema = z.object({
    id: z.number(),
    taskName: z.string(),
    taskDescription: z.string(),
    taskPriority: z.nativeEnum(TaskPriority),
    taskStatus: z.nativeEnum(TaskStatus),
    taskType: z.nativeEnum(TaskType),
    storyPoints: z.number().min(1).max(4),
    sprintId: z.number(),
    dueDate: z.string(),
    assignedTo: z.number(),
    blocked: z.boolean(),
    isActive: z.boolean(),
    isFavorite: z.boolean(),
    changedBy: z.number(),
})
export type UpdateTaskFormValues = z.infer<typeof UpdateTaskSchema>
