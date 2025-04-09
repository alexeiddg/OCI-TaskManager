import {AppUser} from "@/types/model/AppUser";
import {Team} from "@/types/model/Team";
import {Sprint} from "@/types/model/Sprint";

export interface Project {
    id: number;
    projectName: string;
    projectDescription: string;
    manager: AppUser;
    teams: Team[];
    sprints: Sprint[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
