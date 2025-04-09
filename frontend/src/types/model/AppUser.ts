import { UserRole } from "@/types/enums/UserRole";
import { Team } from "@/types/model/Team";

export interface AppUser {
    id: number;
    name: string;
    username: string;
    telegramId: string;
    email: string;
    userRole: UserRole;
    manager: AppUser;
    team: Team;
    createdAt: string;
    updatedAt: string;
}
