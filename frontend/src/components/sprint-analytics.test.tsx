import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { SprintAnalyticsDashboard } from "./sprint-analytics";
import "@testing-library/jest-dom";

// Mock del servidor para interceptar solicitudes HTTP
const server = setupServer(
  rest.get("/api/sprint-analytics", (req, res, ctx) => {
    return res(
      ctx.json({
        id: "1",
        sprintName: "Sprint 1",
        startDate: "2025-04-01",
        endDate: "2025-04-15",
        sprintDescription: "Sprint focused on bug fixes",
        tasks: [
          {
            id: "1",
            taskName: "Fix login bug",
            type: "BUG",
            status: "DONE",
            priority: "HIGH",
            storyPoints: 3,
            dueDate: "2025-04-10",
            blocked: false,
            assignee: { name: "John Doe" },
            createdAt: "2025-04-01",
            completedAt: "2025-04-05",
          },
          {
            id: "2",
            taskName: "Implement dashboard",
            type: "FEATURE",
            status: "IN_PROGRESS",
            priority: "MEDIUM",
            storyPoints: 5,
            dueDate: "2025-04-15",
            blocked: false,
            assignee: { name: "Jane Smith" },
            createdAt: "2025-04-01",
          },
        ],
      })
    );
  })
);

// Configuración del servidor mock
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SprintAnalyticsDashboard", () => {
  it("muestra los datos del sprint correctamente después de cargarlos", async () => {
    render(<SprintAnalyticsDashboard />);

    // Verifica que se muestra el indicador de carga inicialmente
    expect(screen.getByText(/Please wait while we load your analytics/i)).toBeInTheDocument();

    // Espera a que los datos del sprint se carguen
    await waitFor(() => screen.getByText("Sprint 1 Analytics"));

    // Verifica que los datos del sprint se renderizan correctamente
    expect(screen.getByText("Sprint 1 Analytics")).toBeInTheDocument();
    expect(screen.getByText("Sprint focused on bug fixes")).toBeInTheDocument();
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("Implement dashboard")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("maneja errores al cargar los datos del sprint", async () => {
    // Mockear un error en la solicitud
    server.use(
      rest.get("/api/sprint-analytics", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Internal Server Error" }));
      })
    );

    render(<SprintAnalyticsDashboard />);

    // Verifica que se muestra el indicador de carga inicialmente
    expect(screen.getByText(/Please wait while we load your analytics/i)).toBeInTheDocument();

    // Espera a que el error sea manejado
    await waitFor(() => screen.getByText(/Failed to fetch sprint analytics/i));

    // Verifica que se muestra un mensaje de error
    expect(screen.getByText(/Failed to fetch sprint analytics/i)).toBeInTheDocument();
  });
});