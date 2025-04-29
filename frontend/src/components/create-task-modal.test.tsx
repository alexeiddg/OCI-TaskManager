import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskAddModal } from "./create-task-modal";
import "@testing-library/jest-dom";
import { createTaskRequest } from "@/server/api/task/createTask";
import { toast } from "sonner";

// Mock de la función createTaskRequest
jest.mock("@/server/api/task/createTask", () => ({
  createTaskRequest: jest.fn(),
}));

// Mock de la función toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("TaskAddModal Component", () => {
  const mockProps = {
    open: true,
    onOpenChange: jest.fn(),
    sprints: [{ id: 1, sprintName: "Sprint 1" }],
    users: [{ id: 1, name: "John Doe" }],
    currentUser: { id: 1, name: "John Doe" },
    defaultSprintId: 1,
    session: { user: { role: "MANAGER" } },
  };

  it("renders the modal with all form fields", () => {
    render(<TaskAddModal {...mockProps} />);

    // Verificar que los campos del formulario están presentes
    expect(screen.getByLabelText(/Task Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Story Points/i)).toBeInTheDocument();
    expect(screen.getByText(/Sprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned To/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<TaskAddModal {...mockProps} />);

    // Intentar enviar el formulario sin llenar los campos
    fireEvent.click(screen.getByText(/Create Task/i));

    // Verificar que se muestran mensajes de error
    expect(await screen.findByText(/Task Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Priority is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Status is required/i)).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    (createTaskRequest as jest.Mock).mockResolvedValueOnce({ success: true });

    render(<TaskAddModal {...mockProps} />);

    // Llenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText(/Enter task name/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter task description/i), {
      target: { value: "This is a test task" },
    });
    fireEvent.click(screen.getByText(/Medium/i)); // Seleccionar prioridad
    fireEvent.click(screen.getByText(/To Do/i)); // Seleccionar estado
    fireEvent.click(screen.getByText(/Feature/i)); // Seleccionar tipo
    fireEvent.click(screen.getByText(/1 Point/i)); // Seleccionar puntos
    fireEvent.click(screen.getByText(/Sprint 1/i)); // Seleccionar sprint
    fireEvent.click(screen.getByText(/Pick a date/i)); // Abrir calendario
    fireEvent.click(screen.getByText("15")); // Seleccionar fecha

    // Enviar el formulario
    fireEvent.click(screen.getByText(/Create Task/i));

    // Verificar que se llamó a createTaskRequest con los datos correctos
    await waitFor(() => {
      expect(createTaskRequest).toHaveBeenCalledWith({
        taskName: "New Task",
        taskDescription: "This is a test task",
        taskPriority: "MEDIUM",
        taskStatus: "TODO",
        taskType: "FEATURE",
        storyPoints: 1,
        sprint: 1,
        dueDate: expect.any(String), // Fecha seleccionada
        createdBy: 1,
        assignedTo: 1,
        isFavorite: false,
      });
    });

    // Verificar que se muestra un mensaje de éxito
    expect(toast.success).toHaveBeenCalledWith("Task created successfully");

    // Verificar que el modal se cierra
    expect(mockProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles errors during form submission", async () => {
    (createTaskRequest as jest.Mock).mockRejectedValueOnce(new Error("Failed to create task"));

    render(<TaskAddModal {...mockProps} />);

    // Llenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText(/Enter task name/i), {
      target: { value: "New Task" },
    });
    fireEvent.click(screen.getByText(/Create Task/i));

    // Verificar que se muestra un mensaje de error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create task");
    });
  });
});