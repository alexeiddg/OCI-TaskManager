import {Sprint} from "@/types/model/Sprint";
import {TaskPriority} from "@/types/enums/TaskPriority";
import {TaskStatus} from "@/types/enums/TaskStatus";
import {TaskType} from "@/types/enums/TaskType";
import {AppUser} from "@/types/model/AppUser";

export interface Task {
    id: number;
    sprint: Sprint;
    taskName: string;
    taskDescription: string;
    priority: TaskPriority;
    status: TaskStatus;
    type: TaskType;
    storyPoints: number;
    blocked: boolean;
    dueDate: string;
    completedAt: string;
    createdBy: AppUser;
    assignedTo: AppUser;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
