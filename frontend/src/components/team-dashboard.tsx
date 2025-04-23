"use client";

import * as React from "react";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Flag,
  Layers,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings,
  Users,
  MoreHorizontal,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Types
type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
  joinedDate: string;
  availability: number; // percentage
  activeProjects: string[];
  activeSprints: string[];
  tasksCompleted: number;
  tasksInProgress: number;
  storyPointsCompleted: number;
  lastActive: string;
  status: "online" | "offline" | "away" | "busy";
};

type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
  activeSprints: number;
  totalSprints: number;
  members: string[];
  status: "active" | "completed" | "on-hold";
};

type Sprint = {
  id: string;
  name: string;
  projectId: string;
  progress: number;
  startDate: string;
  endDate: string;
  members: string[];
  status: "planning" | "active" | "completed" | "cancelled";
};

type Team = {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  members: TeamMember[];
  projects: Project[];
  sprints: Sprint[];
  completedTasks: number;
  inProgressTasks: number;
  upcomingTasks: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
};

// Sample data
const teamData: Team = {
  id: "team-1",
  name: "Core Development Team",
  description:
    "Responsible for developing and maintaining core product features",
  createdDate: "2024-01-15",
  completedTasks: 87,
  inProgressTasks: 24,
  upcomingTasks: 43,
  totalStoryPoints: 320,
  completedStoryPoints: 215,
  members: [
    {
      id: "user-1",
      name: "John Doe",
      role: "Team Lead",
      email: "john.doe@example.com",
      joinedDate: "2024-01-15",
      availability: 70,
      activeProjects: ["project-1", "project-2"],
      activeSprints: ["sprint-1", "sprint-3"],
      tasksCompleted: 24,
      tasksInProgress: 3,
      storyPointsCompleted: 56,
      lastActive: "10 minutes ago",
      status: "online",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      role: "Frontend Developer",
      email: "jane.smith@example.com",
      joinedDate: "2024-01-20",
      availability: 100,
      activeProjects: ["project-1", "project-3"],
      activeSprints: ["sprint-1", "sprint-4"],
      tasksCompleted: 18,
      tasksInProgress: 4,
      storyPointsCompleted: 42,
      lastActive: "2 hours ago",
      status: "away",
    },
    {
      id: "user-3",
      name: "Alice Johnson",
      role: "Backend Developer",
      email: "alice.johnson@example.com",
      joinedDate: "2024-02-05",
      availability: 90,
      activeProjects: ["project-2", "project-4"],
      activeSprints: ["sprint-2", "sprint-5"],
      tasksCompleted: 15,
      tasksInProgress: 5,
      storyPointsCompleted: 38,
      lastActive: "30 minutes ago",
      status: "online",
    },
    {
      id: "user-4",
      name: "Bob Brown",
      role: "DevOps Engineer",
      email: "bob.brown@example.com",
      joinedDate: "2024-02-10",
      availability: 80,
      activeProjects: ["project-1", "project-2", "project-3"],
      activeSprints: ["sprint-1", "sprint-3"],
      tasksCompleted: 12,
      tasksInProgress: 6,
      storyPointsCompleted: 35,
      lastActive: "1 day ago",
      status: "offline",
    },
    {
      id: "user-5",
      name: "Emma Wilson",
      role: "QA Engineer",
      email: "emma.wilson@example.com",
      joinedDate: "2024-02-15",
      availability: 100,
      activeProjects: ["project-1", "project-4"],
      activeSprints: ["sprint-2", "sprint-4"],
      tasksCompleted: 18,
      tasksInProgress: 2,
      storyPointsCompleted: 44,
      lastActive: "5 hours ago",
      status: "busy",
    },
    {
      id: "user-6",
      name: "Michael Chen",
      role: "UI/UX Designer",
      email: "michael.chen@example.com",
      joinedDate: "2024-03-01",
      availability: 90,
      activeProjects: ["project-3", "project-5"],
      activeSprints: ["sprint-3", "sprint-5"],
      tasksCompleted: 10,
      tasksInProgress: 4,
      storyPointsCompleted: 28,
      lastActive: "3 hours ago",
      status: "online",
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "Website Redesign",
      description:
        "Redesign the company website with modern UI components and improved UX",
      progress: 65,
      startDate: "2025-01-15",
      endDate: "2025-05-30",
      activeSprints: 1,
      totalSprints: 4,
      members: ["user-1", "user-2", "user-4", "user-5"],
      status: "active",
    },
    {
      id: "project-2",
      name: "API Integration",
      description:
        "Integrate third-party APIs for payment processing and data analytics",
      progress: 80,
      startDate: "2025-02-01",
      endDate: "2025-04-15",
      activeSprints: 1,
      totalSprints: 3,
      members: ["user-1", "user-3", "user-4"],
      status: "active",
    },
    {
      id: "project-3",
      name: "Mobile App Development",
      description:
        "Develop cross-platform mobile application with React Native",
      progress: 40,
      startDate: "2025-03-01",
      endDate: "2025-07-30",
      activeSprints: 1,
      totalSprints: 5,
      members: ["user-2", "user-4", "user-6"],
      status: "active",
    },
    {
      id: "project-4",
      name: "Customer Dashboard",
      description:
        "Create dashboard for customers to view their account data and analytics",
      progress: 90,
      startDate: "2025-01-10",
      endDate: "2025-04-10",
      activeSprints: 1,
      totalSprints: 3,
      members: ["user-3", "user-5"],
      status: "active",
    },
    {
      id: "project-5",
      name: "Content Management System",
      description: "Implement CMS for blog and documentation sections",
      progress: 20,
      startDate: "2025-03-15",
      endDate: "2025-06-30",
      activeSprints: 1,
      totalSprints: 4,
      members: ["user-6"],
      status: "active",
    },
  ],
  sprints: [
    {
      id: "sprint-1",
      name: "Sprint 1: Foundation",
      projectId: "project-1",
      progress: 100,
      startDate: "2025-01-15",
      endDate: "2025-01-28",
      members: ["user-1", "user-2", "user-4"],
      status: "completed",
    },
    {
      id: "sprint-2",
      name: "Sprint 2: Core Features",
      projectId: "project-1",
      progress: 75,
      startDate: "2025-01-29",
      endDate: "2025-02-11",
      members: ["user-3", "user-5"],
      status: "active",
    },
    {
      id: "sprint-3",
      name: "Sprint 1: API Integration",
      projectId: "project-2",
      progress: 60,
      startDate: "2025-02-01",
      endDate: "2025-02-14",
      members: ["user-1", "user-4", "user-6"],
      status: "active",
    },
    {
      id: "sprint-4",
      name: "Sprint 1: Mobile App Setup",
      projectId: "project-3",
      progress: 40,
      startDate: "2025-03-01",
      endDate: "2025-03-14",
      members: ["user-2", "user-5"],
      status: "active",
    },
    {
      id: "sprint-5",
      name: "Sprint 3: Dashboard Analytics",
      projectId: "project-4",
      progress: 20,
      startDate: "2025-03-10",
      endDate: "2025-03-23",
      members: ["user-3", "user-6"],
      status: "planning",
    },
  ],
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-chart-2";
    case "away":
      return "bg-chart-3";
    case "busy":
      return "bg-chart-5";
    case "offline":
      return "bg-muted-foreground";
    default:
      return "bg-muted";
  }
};

const getProjectStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-chart-1";
    case "completed":
      return "bg-chart-2";
    case "on-hold":
      return "bg-chart-3";
    default:
      return "bg-muted";
  }
};

const getSprintStatusColor = (status: string) => {
  switch (status) {
    case "planning":
      return "bg-chart-3";
    case "active":
      return "bg-chart-1";
    case "completed":
      return "bg-chart-2";
    case "cancelled":
      return "bg-chart-5";
    default:
      return "bg-muted";
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export function TeamDashboard() {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter members based on search query
  const filteredMembers = React.useMemo(() => {
    if (!searchQuery) return teamData.members;

    return teamData.members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Calculate team metrics
  const teamMetrics = React.useMemo(() => {
    const totalMembers = teamData.members.length;
    const totalProjects = teamData.projects.length;
    const activeSprints = teamData.sprints.filter(
      (s) => s.status === "active",
    ).length;
    const avgAvailability = Math.round(
      teamData.members.reduce((sum, member) => sum + member.availability, 0) /
        totalMembers,
    );
    const teamProgress = Math.round(
      (teamData.completedStoryPoints / teamData.totalStoryPoints) * 100,
    );

    return {
      totalMembers,
      totalProjects,
      activeSprints,
      avgAvailability,
      teamProgress,
    };
  }, []);

  // Calculate project distribution
  const projectDistribution = React.useMemo(() => {
    return teamData.projects.map((project) => ({
      name: project.name,
      members: project.members.length,
      progress: project.progress,
    }));
  }, []);

  // Calculate member contribution
  const memberContribution = React.useMemo(() => {
    return teamData.members.map((member) => ({
      name: member.name,
      tasksCompleted: member.tasksCompleted,
      storyPoints: member.storyPointsCompleted,
    }));
  }, []);

  // Calculate activity over time (last 14 days)
  const activityData = React.useMemo(() => {
    const today = new Date();
    const data = [];

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      // Generate random data for demonstration
      const tasksCompleted = Math.floor(Math.random() * 8) + 1;
      const storyPoints = Math.floor(Math.random() * 15) + 5;

      data.push({
        date: dateString,
        tasksCompleted,
        storyPoints,
      });
    }

    return data;
  }, []);

  return (
    <div className="space-y-6 px-6 py-6 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{teamData.name}</h2>
            <Badge variant="outline" className="ml-2">
              {teamData.members.length} Members
            </Badge>
          </div>
          <p className="text-muted-foreground">{teamData.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Contact Team
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.totalMembers}</div>
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Active since {formatDate(teamData.createdDate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMetrics.totalProjects}
            </div>
            <div className="flex items-center mt-2">
              <Layers className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                {teamData.projects.filter((p) => p.status === "active").length}{" "}
                in progress
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sprints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMetrics.activeSprints}
            </div>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                {teamData.sprints.filter((s) => s.status === "planning").length}{" "}
                in planning
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Team Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMetrics.avgAvailability}%
            </div>
            <Progress
              value={teamMetrics.avgAvailability}
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Average team capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMetrics.teamProgress}%
            </div>
            <Progress value={teamMetrics.teamProgress} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {teamData.completedStoryPoints} of {teamData.totalStoryPoints}{" "}
              story points
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Team Activity</TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Team Roster</h3>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                        />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {member.name}
                        </CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full mr-2",
                          getStatusColor(member.status),
                        )}
                        aria-hidden="true"
                      />
                      <span className="text-xs capitalize">
                        {member.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Availability
                      </span>
                      <span>{member.availability}%</span>
                    </div>
                    <Progress value={member.availability} className="h-1.5" />

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Tasks
                        </div>
                        <div className="font-medium">
                          {member.tasksCompleted} /{" "}
                          {member.tasksCompleted + member.tasksInProgress}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Story Points
                        </div>
                        <div className="font-medium">
                          {member.storyPointsCompleted}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Projects
                        </div>
                        <div className="font-medium">
                          {member.activeProjects.length}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Sprints
                        </div>
                        <div className="font-medium">
                          {member.activeSprints.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3 pb-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Active {member.lastActive}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Remove from team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No members found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? `No members matching "${searchQuery}"`
                  : "Try adding team members"}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>
                  Team members assigned to each project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectDistribution}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar
                        dataKey="members"
                        name="Team Members"
                        fill="var(--color-chart-1)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>
                  Completion status of active projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamData.projects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full mr-2",
                              getProjectStatusColor(project.status),
                            )}
                          />
                          <span className="font-medium">{project.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {project.activeSprints} active sprint
                          {project.activeSprints !== 1 ? "s" : ""}
                        </span>
                        <span>{project.members.length} members</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Timeline of all team projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <div className="min-w-[800px]">
                  {teamData.projects.map((project) => {
                    const startDate = new Date(project.startDate);
                    const endDate = new Date(project.endDate);
                    const today = new Date();

                    // Calculate total duration in days
                    const totalDuration = Math.ceil(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24),
                    );

                    // Calculate elapsed duration in days
                    const elapsedDuration = Math.min(
                      totalDuration,
                      Math.max(
                        0,
                        Math.ceil(
                          (today.getTime() - startDate.getTime()) /
                            (1000 * 60 * 60 * 24),
                        ),
                      ),
                    );

                    // Calculate position and width percentages
                    const progressPercent =
                      (elapsedDuration / totalDuration) * 100;
                    const remainingPercent = 100 - progressPercent;

                    return (
                      <div key={project.id} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span
                              className={cn(
                                "h-2.5 w-2.5 rounded-full mr-2",
                                getProjectStatusColor(project.status),
                              )}
                            />
                            <span className="font-medium">{project.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(project.startDate)} -{" "}
                            {formatDate(project.endDate)}
                          </div>
                        </div>
                        <div className="h-8 bg-secondary rounded-md overflow-hidden flex">
                          <div
                            className="bg-chart-1 h-full flex items-center justify-end px-2 text-xs text-white font-medium"
                            style={{ width: `${progressPercent}%` }}
                          >
                            {progressPercent > 15 &&
                              `${Math.round(progressPercent)}%`}
                          </div>
                          <div
                            className="bg-secondary h-full flex items-center px-2 text-xs"
                            style={{ width: `${remainingPercent}%` }}
                          >
                            {remainingPercent > 15 &&
                              `${Math.round(remainingPercent)}% remaining`}
                          </div>
                        </div>
                        <div className="flex mt-1 text-xs">
                          <div className="flex items-center mr-4">
                            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{project.members.length} members</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>
                              {project.activeSprints} active sprint
                              {project.activeSprints !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>
                Tasks completed and story points over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    tasksCompleted: {
                      label: "Tasks Completed",
                      color: "hsl(var(--chart-1))",
                    },
                    storyPoints: {
                      label: "Story Points",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={activityData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorTasks"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPoints"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-chart-2)"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-chart-2)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                      />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="tasksCompleted"
                        stroke="var(--color-chart-1)"
                        fillOpacity={1}
                        fill="url(#colorTasks)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="storyPoints"
                        stroke="var(--color-chart-2)"
                        fillOpacity={1}
                        fill="url(#colorPoints)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Member Contributions</CardTitle>
                <CardDescription>
                  Tasks completed by each team member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={memberContribution}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="tasksCompleted"
                        name="Tasks Completed"
                        fill="var(--color-chart-1)"
                      />
                      <Bar
                        dataKey="storyPoints"
                        name="Story Points"
                        fill="var(--color-chart-2)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sprint Participation</CardTitle>
                <CardDescription>
                  Team members assigned to active sprints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamData.sprints
                    .filter(
                      (sprint) =>
                        sprint.status === "active" ||
                        sprint.status === "planning",
                    )
                    .map((sprint) => (
                      <div key={sprint.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span
                              className={cn(
                                "h-2.5 w-2.5 rounded-full mr-2",
                                getSprintStatusColor(sprint.status),
                              )}
                            />
                            <TooltipProvider>
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <span className="font-medium truncate max-w-[200px]">
                                    {sprint.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{sprint.name}</p>
                                </TooltipContent>
                              </UITooltip>
                            </TooltipProvider>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {sprint.progress}%
                          </span>
                        </div>
                        <Progress value={sprint.progress} className="h-2" />
                        <div className="flex flex-wrap gap-1 mt-1">
                          {sprint.members.map((memberId) => {
                            const member = teamData.members.find(
                              (m) => m.id === memberId,
                            );
                            if (!member) return null;

                            return (
                              <TooltipProvider key={memberId}>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={
                                          member.avatar || "/placeholder.svg"
                                        }
                                        alt={member.name}
                                      />
                                      <AvatarFallback>
                                        {member.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{member.name}</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Task Status</CardTitle>
              <CardDescription>Overview of all team tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-3xl font-bold">
                    {teamData.completedTasks}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-chart-2 mr-1" />
                    <span>Completed Tasks</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-3xl font-bold">
                    {teamData.inProgressTasks}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Activity className="h-4 w-4 text-chart-1 mr-1" />
                    <span>In Progress</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-3xl font-bold">
                    {teamData.upcomingTasks}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Flag className="h-4 w-4 text-chart-3 mr-1" />
                    <span>Upcoming Tasks</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
