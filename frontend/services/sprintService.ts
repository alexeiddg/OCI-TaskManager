import { Sprint } from "@/model/Sprint";

const API_URL = "http://localhost:8080/api/v1/sprint";

//TODO: Refactor this service to use the same format

export const SprintService = {
  // Get a sprint by ID
  getSprintById: async (sprintId: number): Promise<Sprint | null> => {
    try {
      console.log("Llega getsprint");
      const response = await fetch(`${API_URL}/${sprintId}`);
      if (!response.ok) return null;
      const data = await response.json();
      console.log("Response data: ", data);
      return data;
    } catch (error) {
      console.error("Error fetching sprint by ID:", error);
      return null;
    }
  },

  // Get all sprints
  getAllSprints: async (): Promise<Sprint[]> => {
    try {
      const response = await fetch(API_URL);
      return await response.json();
    } catch (error) {
      console.error("Error fetching all sprints:", error);
      return [];
    }
  },

  // Get sprints for a specific project
  getSprintsByProject: async (projectId: number): Promise<Sprint[]> => {
    try {
      const response = await fetch(`${API_URL}/project/${projectId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching sprints by project:", error);
      return [];
    }
  },

  // Create a new sprint
  createSprint: async (sprint: Sprint): Promise<Sprint | null> => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sprint),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error creating sprint:", error);
      return null;
    }
  },

  // Delete a sprint
  deleteSprint: async (sprintId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${sprintId}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting sprint:", error);
      return false;
    }
  },

  // Start a sprint
  startSprint: async (sprintId: number): Promise<Sprint | null> => {
    try {
      const response = await fetch(`${API_URL}/${sprintId}/start`, {
        method: "POST",
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error starting sprint:", error);
      return null;
    }
  },

  // Complete a sprint
  completeSprint: async (sprintId: number): Promise<Sprint | null> => {
    try {
      const response = await fetch(`${API_URL}/${sprintId}/complete`, {
        method: "POST",
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error completing sprint:", error);
      return null;
    }
  },

  // Update a sprint
  updateSprint: async (
    sprintId: number,
    updatedSprint: Sprint
  ): Promise<Sprint | null> => {
    try {
      const response = await fetch(`${API_URL}/${sprintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSprint),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error updating sprint:", error);
      return null;
    }
  },

  // Get tasks assigned to a sprint
  getTasksBySprint: async (sprintId: number): Promise<any[]> => {
    try {
      const response = await fetch(`${API_URL}/${sprintId}/tasks`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error fetching tasks for sprint:", error);
      return [];
    }
  },

  // Calculate sprint velocity
  getSprintVelocity: async (sprintId: number): Promise<number | null> => {
    try {
      const response = await fetch(`${API_URL}/${sprintId}/velocity`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error calculating sprint velocity:", error);
      return null;
    }
  },

  // Calculate completion rate
  getSprintCompletionRate: async (sprintId: number): Promise<number | null> => {
    try {
      const response = await fetch(`${API_URL}/${sprintId}/completion-rate`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error calculating completion rate:", error);
      return null;
    }
  },
};

// Create a Sprint
export const createSprint = async (sprint: Sprint) => {
  try {
    const response = await fetch("http://localhost:3000/api/sprints/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...sprint,
        startDate: new Date(sprint.startDate).toISOString(), // Ensure correct format
        endDate: new Date(sprint.endDate).toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create sprint");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating sprint:", error);
    return null;
  }
};

// Fetch projects (since a sprint needs to belong to one)
export const getProjects = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/projects");

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
