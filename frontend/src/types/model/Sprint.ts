import {Project} from "@/types/model/Project";
import {Task} from "@/types/model/Task";

export interface Sprint {
    id: number;
    sprintName: string;
    startDate: string;
    endDate: string;
    project: Project;
    tasks: Task[];
    completedTasks: number;
    totalTasks: number;
    completionRate: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
