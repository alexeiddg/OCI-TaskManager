import { UserRole } from "@/lib/types/enums/UserRole";

export interface LoginResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  managerId: number;
  teamId: number;
  token: string;
}
