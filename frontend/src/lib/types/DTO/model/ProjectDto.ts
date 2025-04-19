import { z } from "zod";

export const SprintSummaryDtoSchema = z.object({
  id: z.number(),
  sprintName: z.string(),
});

export const ProjectDtoSchema = z.object({
  id: z.number(),
  projectName: z.string(),
  projectDescription: z.string(),
  progress: z.number(),
  favorite: z.boolean(),
  managerId: z.number(),
  managerName: z.string(),
  teamId: z.number(),
  teamName: z.string(),
  sprints: z.array(SprintSummaryDtoSchema),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export const ProjectListSchema = z.array(ProjectDtoSchema);
export type ProjectDto = z.infer<typeof ProjectDtoSchema>;
export type SprintSummaryDto = z.infer<typeof SprintSummaryDtoSchema>;
