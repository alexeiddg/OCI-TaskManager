export interface User {
    userId: number;
    name: string;
    username: string;
    role: "DEVELOPER" | "MANAGER";
    telegramId?: string;
    createdAt: string;
    updatedAt?: string;
}
