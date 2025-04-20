import { z } from "zod";
import {ProjectDtoSchema, ProjectListSchema} from '@/lib/types/DTO/model/ProjectDto'
import {SprintSchema} from "@/lib/types/DTO/model/SprintDto";
import {Task} from "@/lib/types/DTO/model/Task";

export const ProjectOptionSchema = z.object({
    id: ProjectDtoSchema.shape.id,
    name: ProjectDtoSchema.shape.projectName,
});
export type ProjectOption = z.infer<typeof ProjectOptionSchema>;

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchProjectOptions(
    teamId: number,
    userId: number
): Promise<ProjectOption[]> {
    const url = `${BASE_URL}/api/v2/projects/team/${teamId}/user/${userId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch project options.");
    }

    const data = await response.json();
    const parsed = ProjectListSchema.safeParse(data);

    if (!parsed.success) {
        console.error("Invalid project data", parsed.error);
        throw new Error("Invalid project data format received.");
    }

    const options = parsed.data.map((project) => ({
        id: project.id,
        name: project.projectName,
    }));

    const validated = z.array(ProjectOptionSchema).safeParse(options);

    if (!validated.success) {
        console.error("Invalid project option shape", validated.error);
        throw new Error("Invalid shape for project options.");
    }

    return validated.data;
}

// fetch sprints w/tasks
export const SprintCardsSchema = z.object({
    id: SprintSchema.shape.id,
    name: SprintSchema.shape.sprintName,
    goal: SprintSchema.shape.sprintDescription.nullable(),
    projectId: SprintSchema.shape.projectId,
    startDate: SprintSchema.shape.startDate,
    endDate: SprintSchema.shape.endDate,
    status: SprintSchema.shape.status.nullable(),
    progress: SprintSchema.shape.completionRate.nullable(),
    tasks: z.array(
        z.object({
            id: Task.shape.id,
            name: Task.shape.taskName,
            assignee: Task.shape.assignedToUsername,
            completed: z.boolean(),
            priority: Task.shape.priority,
            estimate: Task.shape.storyPoints,
        })
    ),
})
export type SprintCards = z.infer<typeof SprintCardsSchema>;



export async function fetchSprintCards(projectId: number) {
    const response = await fetch(`${BASE_URL}/api/v2/sprint/project/${projectId}/sprints`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch sprint cards.");
    }

    const data = await response.json();
    const parsed = z.array(SprintCardsSchema).safeParse(data);

    if (!parsed.success) {
        console.error("SprintCards schema validation failed", parsed.error);
        throw new Error("Invalid sprint cards data format");
    }

    return parsed.data;
}
