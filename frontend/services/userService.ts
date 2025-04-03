import { User } from "@/model/User";

export const createUser = async (name: string, username: string, role: "DEVELOPER" | "MANAGER"): Promise<User | null> => {
    try {
        const response = await fetch("/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, role }),
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
};

export const loginUser = async (username: string): Promise<User | null> => {
    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            throw new Error("User not found");
        }

        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
};


