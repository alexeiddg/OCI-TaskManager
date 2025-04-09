import { AppUser } from "@/types/model/AppUser";
import { Project } from "@/types/model/Project";

export interface Team {
    id: number;
    teamName: string;
    manager: AppUser;
    project: Project;
    members: AppUser[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
