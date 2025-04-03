export interface Project {
    projectId?: number;
    projectName: string;
    projectDesc?: string;
    manager: {
        userId: number;
        name: string;
        username: string;
    };
    developers?: { userId: number; name: string; username: string }[];
    createdAt?: string;
    updatedAt?: string;
}
