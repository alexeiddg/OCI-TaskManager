import { z } from 'zod';
import {Task} from "@/lib/types/DTO/model/Task";
import {SprintStatus} from "@/lib/types/enums/SprintStatus";

export interface SprintDto {
  id: number;
  sprintName: string;
}

export const SprintSchema = z.object({
  id: z.number(),
  sprintName: z.string(),
  sprintDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.nativeEnum(SprintStatus),
  projectId: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  completedTasks: z.number().nullable(),
  totalTasks: z.number().nullable(),
  completionRate: z.number().nullable(),
  tasks: z.array(Task).optional(),
})
