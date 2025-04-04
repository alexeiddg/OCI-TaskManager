import { Project } from "@/model/Project";
import {User} from "@/model/User";

const API_URL = "http://localhost:8080/api/v1/project";

// Fetch projects assigned to a specific user
export const getProjectsByUser = async (userId: number): Promise<Project[] | null> => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`);
        console.log("Fetch Done", response)

        if (!response.ok) {
            throw new Error("Failed to fetch projects");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        return null;
    }
};

export const getAvailableDevelopers = async (): Promise<User[] | null> => {
    try {
        const response = await fetch("/api/users/projects/without-projects");
        if (!response.ok) throw new Error("Failed to fetch users");

        return await response.json();
    } catch (error) {
        console.error("Error fetching developers:", error);
        return null;
    }
};

/** Fetch the logged-in user from local storage */
export const getLoggedInUser = (): User | null => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
        return JSON.parse(storedUser) as User;
    } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
        return null;
    }
};

export const createProject = async (project: Project): Promise<Project | null> => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
        });

        if (!response.ok) {
            throw new Error("Failed to create project");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating project:", error);
        return null;
    }
};
