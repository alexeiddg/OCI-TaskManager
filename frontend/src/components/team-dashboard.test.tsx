import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TeamDashboard } from "./team-dashboard";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

// Mock Data
const mockTeamData = {
  id: "team-1",
  name: "Core Development Team",
  description: "Responsible for developing and maintaining core product features",
  members: [
    {
      id: "user-1",
      name: "John Doe",
      role: "Team Lead",
      availability: 70,
      tasksCompleted: 24,
      tasksInProgress: 3,
      storyPointsCompleted: 56,
      status: "online",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      role: "Frontend Developer",
      availability: 100,
      tasksCompleted: 18,
      tasksInProgress: 4,
      storyPointsCompleted: 42,
      status: "away",
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "Website Redesign",
      progress: 65,
      status: "active",
    },
  ],
  sprints: [
    {
      id: "sprint-1",
      name: "Sprint 1",
      progress: 100,
      status: "completed",
    },
  ],
  completedTasks: 87,
  inProgressTasks: 24,
  upcomingTasks: 43,
  totalStoryPoints: 320,
  completedStoryPoints: 215,
};

// Mock Functions
jest.mock("./team-dashboard", () => ({
  ...jest.requireActual("./team-dashboard"),
  getTeamData: jest.fn(() => mockTeamData),
}));

describe("TeamDashboard Component", () => {
  it("renders the team name and description", () => {
    render(<TeamDashboard />);
    expect(screen.getByText("Core Development Team")).toBeInTheDocument();
    expect(screen.getByText("Responsible for developing and maintaining core product features")).toBeInTheDocument();
  });

  it("displays team metrics correctly", () => {
    render(<TeamDashboard />);
    expect(screen.getByText("87")).toBeInTheDocument(); // Completed Tasks
    expect(screen.getByText("24")).toBeInTheDocument(); // In Progress Tasks
    expect(screen.getByText("43")).toBeInTheDocument(); // Upcoming Tasks
    expect(screen.getByText("215 of 320 story points")).toBeInTheDocument();
  });

  it("filters team members based on search query", async () => {
    render(<TeamDashboard />);
    const searchInput = screen.getByPlaceholderText("Search members...");
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  it("matches the snapshot", () => {
    const { container } = render(<TeamDashboard />);
    expect(container).toMatchSnapshot();
  });

  it("handles no members found when search query does not match", async () => {
    render(<TeamDashboard />);
    const searchInput = screen.getByPlaceholderText("Search members...");
    fireEvent.change(searchInput, { target: { value: "Nonexistent" } });

    await waitFor(() => {
      expect(screen.getByText("No members found")).toBeInTheDocument();
      expect(screen.getByText('No members matching "Nonexistent"')).toBeInTheDocument();
    });
  });

  it("renders project distribution chart", () => {
    render(<TeamDashboard />);
    expect(screen.getByText("Project Distribution")).toBeInTheDocument();
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
  });

  it("renders team activity chart", () => {
    render(<TeamDashboard />);
    expect(screen.getByText("Team Activity")).toBeInTheDocument();
  });
});