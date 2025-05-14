// src/lib/schemas/sprintWithDepsSchema.ts
import { z } from "zod";
import { TaskType } from "@/lib/types/enums/TaskType";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";
import { TaskPriority } from "@/lib/types/enums/TaskPriority";
import { UserRole } from "@/lib/types/enums/UserRole";
import { SprintStatus } from "@/lib/types/enums/SprintStatus";
import { AppUserDtoSchema } from "@/lib/types/DTO/model/AppUserDtoSchema";

export const TasksForAnalyticsSchema = z.object({
  id: z.number(),
  taskName: z.string(),
  type: z.nativeEnum(TaskType),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  storyPoints: z.number(),
  dueDate: z.string().transform((s) => new Date(s)),
  completedAt: z
    .string()
    .nullable()
    .transform((s) => (s ? new Date(s) : null)),
  blocked: z.boolean(),
  assignee: AppUserDtoSchema.nullable(),
  createdAt: z.string().transform((s) => new Date(s)),
});

export const TeamMemberForAnalyticsSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  role: z.nativeEnum(UserRole),
});

export const ProjectForAnalyticsSchema = z.object({
  id: z.number(),
  projectName: z.string(),
  projectDescription: z.string(),
});

export const SprintForAnalyticsSchema = z.object({
  id: z.number(),
  sprintName: z.string(),
  sprintDescription: z.string().nullable(),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => new Date(s)),
  status: z.nativeEnum(SprintStatus).nullable(),
  project: ProjectForAnalyticsSchema,
  teamMembers: z.array(TeamMemberForAnalyticsSchema),
  tasks: z.array(TasksForAnalyticsSchema),
});

export type SprintForAnalyticsModel = z.infer<typeof SprintForAnalyticsSchema>;
