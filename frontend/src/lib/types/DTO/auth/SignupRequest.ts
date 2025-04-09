import {UserRole} from "@/lib/types/enums/UserRole";

export interface SignupRequest {
    name: string;
    username: string;
    password: string;
    email: string;
    role: UserRole;
}
