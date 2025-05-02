import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { SprintAnalyticsDashboard } from "../../components/sprint-analytics"; // ajustá la ruta
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: 1,
        teamId: 1,
        name: "Test User",
      },
    },
  }),
}));

jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

jest.mock("@/server/api/kpi/getKpis", () => ({
  fetchKpiDto: jest.fn().mockResolvedValue({
    efficiency: 1.25,
    averageLoggedHours: 7.5,
    bugsVsFeatures: 0.6,
    taskTypeBreakdown: {
      bugs: 3,
      features: 5,
      chores: 2,
    },
  }),
  fetchTeamKpiDto: jest.fn().mockResolvedValue({
    sprintVelocity: 80,
    completionRate: 0.9,
    averageEfficiency: 1.5,
    averageCompletionTime: 2.4,
    bugFeatureRatio: 0.5,
    workloadBalance: 0.8,
    blockedTasks: 1,
    highPriorityPending: 2,
    overdueTasks: 0,
    scopeAtRisk: false,
    totalTimeLogged: 120,
    taskTypeBreakdown: {
      bugs: 10,
      features: 30,
      chores: 5,
    },
    progressForecast: {
      timeElapsed: 50,
      workCompleted: 60,
    },
    focusScore: 75,
    topContributors: [],
  }),
}));

jest.mock("@/server/api/sprint/getSprintAnalytics", () => ({
  fetchSprintAnalytics: jest.fn().mockResolvedValue({
    id: 1,
    sprintName: "Sprint 1",
    sprintDescription: "Demo sprint",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-14"),
    tasks: [
      {
        id: 1,
        taskName: "Fix login bug",
        type: "BUG",
        status: "TODO",
        priority: "HIGH",
        storyPoints: 3,
        sprintId: 1,
        sprintName: "Sprint 1",
        dueDate: new Date("2024-01-10"),
        completedAt: null,
        createdById: 1,
        createdByUsername: "dev1",
        assignedToUsername: "Test User",
        blocked: true,
        isActive: true,
        createdAt: new Date("2023-12-28"),
        updatedAt: null,
        completed: false,
        favorite: false,
      },
    ],
  }),
}));

describe("SprintAnalyticsDashboard", () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  test("renders personal KPIs correctly", async () => {
    render(<SprintAnalyticsDashboard />);

    const user = userEvent.setup();

    await waitFor(() =>
      expect(
        screen.queryByText(/Please wait while we load/i)
      ).not.toBeInTheDocument()
    );

    // Verifica que el título del sprint aparezca
    expect(screen.getByText(/Sprint 1 Analytics/i)).toBeInTheDocument();

    const personalKPIsTab = await screen.findByRole("tab", {
      name: /Personal KPIs/i,
    });

    await user.click(personalKPIsTab);

    await waitFor(() => {
      expect(personalKPIsTab).toHaveAttribute("aria-selected", "true");

      expect(screen.getByText(/completed by you/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Personal Sprint Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Personal Completion Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Efficiency Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Completion Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Bugs Vs Features Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Workload Balance/i)).toBeInTheDocument();
  });
  test("renders team KPIs correctly", async () => {
    render(<SprintAnalyticsDashboard />);

    const user = userEvent.setup();

    await waitFor(() =>
      expect(
        screen.queryByText(/Please wait while we load/i)
      ).not.toBeInTheDocument()
    );

    // Verifica que el título del sprint aparezca
    expect(screen.getByText(/Sprint 1 Analytics/i)).toBeInTheDocument();

    const personalKPIsTab = await screen.findByRole("tab", {
      name: /Team KPIs/i,
    });

    await user.click(personalKPIsTab);

    await waitFor(() => {
      expect(personalKPIsTab).toHaveAttribute("aria-selected", "true");

      expect(screen.getByText(/team hours/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Team Sprint Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Completion Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Bug:Feature Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Contextual Metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Risk Indicators/i)).toBeInTheDocument();
  });

  test("renders the correct info between dashboard tabs", async () => {
    render(<SprintAnalyticsDashboard />);

    const user = userEvent.setup();
    const clickAndCheckTab = async (tabName: string, expectedText: string) => {
      const tab = await screen.findByRole("tab", {
        name: new RegExp(tabName, "i"),
      });
      await user.click(tab);
      await waitFor(() => {
        expect(tab).toHaveAttribute("aria-selected", "true");
        expect(
          screen.getByText(new RegExp(expectedText, "i"))
        ).toBeInTheDocument();
      });
    };

    await waitFor(() =>
      expect(
        screen.queryByText(/Please wait while we load/i)
      ).not.toBeInTheDocument()
    );

    expect(screen.getByText(/Sprint 1 Analytics/i)).toBeInTheDocument();

    expect(screen.getByText(/Sprint Burndown/i)).toBeInTheDocument();

    await clickAndCheckTab("Task Distribution", "tasks by team member");
    await clickAndCheckTab("Risks & Blockers", "potential issues");
    await clickAndCheckTab("Personal KPIs", "completed by you");
    await clickAndCheckTab("Team KPIs", "team hours");
  });
});
