export interface Task {
    taskId?: number;
    title: string;
    description?: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
    projectId: number;
    sprintId?: number;
    teamId: number;
    assignedTo?: number; // User ID
    taskType: "BUG" | "FEATURE" | "IMPROVEMENT";
    storyPoints?: number;
    dueDate?: string; // Format: YYYY-MM-DD
}
