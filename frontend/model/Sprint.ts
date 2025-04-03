import { Project } from "@/model/Project";

export interface Sprint {
    sprintId?: number;
    project: Project;
    sprintName: string;
    startDate: string;
    endDate: string;
    // teams: Team[];
    totalTasks?: number;
    completedTasks?: number;
    sprintVelocity?: number;
    completionRate?: number;
}
