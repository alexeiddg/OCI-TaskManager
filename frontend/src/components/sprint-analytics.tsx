"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type Task = {
  id: string;
  title: string;
  type: string;
  status: "TODO" | "IN PROGRESS" | "DONE" | "BLOCKED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  storyPoints: number;
  sprint: string;
  dueDate: string;
  blocked: boolean;
  assignee?: string;
  createdAt: string;
  completedAt?: string;
};

type SprintData = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  goal: string;
};

// Sample data for demonstration
const sprintData: SprintData = {
  id: "sprint-1",
  name: "Sprint 1",
  startDate: "2025-04-10",
  endDate: "2025-04-24",
  goal: "Implement authentication flow and core user features",
  tasks: [
    {
      id: "task-1",
      title: "Implement login page",
      type: "FEATURE",
      status: "IN PROGRESS",
      priority: "HIGH",
      storyPoints: 5,
      sprint: "Sprint 1",
      dueDate: "2025-04-25",
      blocked: false,
      assignee: "John Doe",
      createdAt: "2025-04-10",
    },
    {
      id: "task-2",
      title: "Write unit tests for JWT refresh flow",
      type: "FEATURE",
      status: "IN PROGRESS",
      priority: "HIGH",
      storyPoints: 4,
      sprint: "Sprint 1",
      dueDate: "2025-04-24",
      blocked: false,
      assignee: "Jane Smith",
      createdAt: "2025-04-11",
    },
    {
      id: "task-3",
      title: "Design user profile page",
      type: "DESIGN",
      status: "DONE",
      priority: "MEDIUM",
      storyPoints: 3,
      sprint: "Sprint 1",
      dueDate: "2025-04-15",
      blocked: false,
      assignee: "Alice Johnson",
      createdAt: "2025-04-10",
      completedAt: "2025-04-14",
    },
    {
      id: "task-4",
      title: "Implement password reset functionality",
      type: "FEATURE",
      status: "TODO",
      priority: "MEDIUM",
      storyPoints: 3,
      sprint: "Sprint 1",
      dueDate: "2025-04-22",
      blocked: false,
      assignee: "Bob Brown",
      createdAt: "2025-04-12",
    },
    {
      id: "task-5",
      title: "Fix cross-browser compatibility issues",
      type: "BUG",
      status: "TODO",
      priority: "LOW",
      storyPoints: 2,
      sprint: "Sprint 1",
      dueDate: "2025-04-23",
      blocked: false,
      assignee: "John Doe",
      createdAt: "2025-04-13",
    },
    {
      id: "task-6",
      title: "Implement user registration",
      type: "FEATURE",
      status: "DONE",
      priority: "HIGH",
      storyPoints: 5,
      sprint: "Sprint 1",
      dueDate: "2025-04-18",
      blocked: false,
      assignee: "Jane Smith",
      createdAt: "2025-04-10",
      completedAt: "2025-04-17",
    },
    {
      id: "task-7",
      title: "Set up CI/CD pipeline",
      type: "DEVOPS",
      status: "BLOCKED",
      priority: "HIGH",
      storyPoints: 8,
      sprint: "Sprint 1",
      dueDate: "2025-04-20",
      blocked: true,
      assignee: "Bob Brown",
      createdAt: "2025-04-11",
    },
    {
      id: "task-8",
      title: "Create API documentation",
      type: "DOCUMENTATION",
      status: "TODO",
      priority: "LOW",
      storyPoints: 2,
      sprint: "Sprint 1",
      dueDate: "2025-04-24",
      blocked: false,
      assignee: "Alice Johnson",
      createdAt: "2025-04-14",
    },
  ],
};

// Generate burndown data based on sprint and tasks
const generateBurndownData = (sprint: SprintData) => {
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

  const totalStoryPoints = sprint.tasks.reduce(
    (sum, task) => sum + task.storyPoints,
    0,
  );
  const idealBurndown = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const remainingPoints =
      totalStoryPoints - (totalStoryPoints / (totalDays - 1)) * i;
    return {
      date: date.toISOString().split("T")[0],
      ideal: Math.max(0, Math.round(remainingPoints * 10) / 10),
    };
  });

  // Calculate actual burndown based on task completion dates
  const actualBurndown = idealBurndown.map((day) => {
    const dayDate = new Date(day.date);
    const completedTasks = sprint.tasks.filter((task) => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate <= dayDate;
    });

    const completedPoints = completedTasks.reduce(
      (sum, task) => sum + task.storyPoints,
      0,
    );
    const remaining = totalStoryPoints - completedPoints;

    return {
      ...day,
      actual: remaining,
    };
  });

  // For days in the future, use the last known actual value
  const today = new Date().toISOString().split("T")[0];
  let lastActual =
    actualBurndown.find((d) => d.date === today)?.actual ||
    actualBurndown[actualBurndown.length - 1].actual;

  return actualBurndown.map((day) => {
    const dayDate = new Date(day.date);
    const currentDate = new Date();

    if (dayDate > currentDate) {
      return {
        ...day,
        actual: lastActual,
        forecast: lastActual,
      };
    }

    lastActual = day.actual;
    return day;
  });
};

// Generate velocity data
const generateVelocityData = (sprint: SprintData) => {
  const statusCounts = {
    todo: sprint.tasks.filter((t) => t.status === "TODO").length,
    inProgress: sprint.tasks.filter((t) => t.status === "IN PROGRESS").length,
    done: sprint.tasks.filter((t) => t.status === "DONE").length,
    blocked: sprint.tasks.filter((t) => t.status === "BLOCKED").length,
  };

  const statusPoints = {
    todo: sprint.tasks
      .filter((t) => t.status === "TODO")
      .reduce((sum, t) => sum + t.storyPoints, 0),
    inProgress: sprint.tasks
      .filter((t) => t.status === "IN PROGRESS")
      .reduce((sum, t) => sum + t.storyPoints, 0),
    done: sprint.tasks
      .filter((t) => t.status === "DONE")
      .reduce((sum, t) => sum + t.storyPoints, 0),
    blocked: sprint.tasks
      .filter((t) => t.status === "BLOCKED")
      .reduce((sum, t) => sum + t.storyPoints, 0),
  };

  return { statusCounts, statusPoints };
};

export function SprintAnalyticsDashboard() {
  const [selectedSprint, setSelectedSprint] = React.useState<string>(
    sprintData.id,
  );
  const burndownData = React.useMemo(
    () => generateBurndownData(sprintData),
    [],
  );
  const velocityData = React.useMemo(
    () => generateVelocityData(sprintData),
    [],
  );

  // Calculate sprint metrics
  const totalTasks = sprintData.tasks.length;
  const completedTasks = sprintData.tasks.filter(
    (t) => t.status === "DONE",
  ).length;
  const totalPoints = sprintData.tasks.reduce(
    (sum, t) => sum + t.storyPoints,
    0,
  );
  const completedPoints = sprintData.tasks
    .filter((t) => t.status === "DONE")
    .reduce((sum, t) => sum + t.storyPoints, 0);
  const sprintProgress = Math.round((completedPoints / totalPoints) * 100) || 0;

  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(sprintData.endDate);
  const daysRemaining = Math.max(
    0,
    Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );

  // Task distribution by type
  const tasksByType = React.useMemo(() => {
    const types = [...new Set(sprintData.tasks.map((t) => t.type))];
    return types.map((type) => ({
      name: type,
      value: sprintData.tasks.filter((t) => t.type === type).length,
    }));
  }, []);

  // Task distribution by assignee
  const tasksByAssignee = React.useMemo(() => {
    const assignees = [
      ...new Set(
        sprintData.tasks.map((t) => t.assignee).filter(Boolean) as string[],
      ),
    ];
    return assignees.map((assignee) => ({
      name: assignee,
      value: sprintData.tasks.filter((t) => t.assignee === assignee).length,
    }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{sprintData.name} Analytics</h2>
          <p className="text-muted-foreground">{sprintData.goal}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedSprint} onValueChange={setSelectedSprint}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={sprintData.id}>{sprintData.name}</SelectItem>
              <SelectItem value="sprint-2">Sprint 2</SelectItem>
              <SelectItem value="sprint-3">Sprint 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {sprintData.startDate} - {sprintData.endDate}
          </Button>
        </div>
      </div>

      {/* Sprint Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Sprint Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sprintProgress}%</div>
            <Progress value={sprintProgress} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Story Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedPoints}/{totalPoints}
            </div>
            <Progress
              value={(completedPoints / totalPoints) * 100}
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((completedPoints / totalPoints) * 100)}% of points
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Days Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysRemaining}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Sprint ends on {sprintData.endDate}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-chart-3 mr-1"></span>
                <span>Todo: {velocityData.statusCounts.todo}</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-chart-1 mr-1"></span>
                <span>In Progress: {velocityData.statusCounts.inProgress}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-chart-2 mr-1"></span>
                <span>Done: {velocityData.statusCounts.done}</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-chart-5 mr-1"></span>
                <span>Blocked: {velocityData.statusCounts.blocked}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="burndown">
        <TabsList className="grid grid-cols-4 mt-4">
          <TabsTrigger value="burndown">Burndown Chart</TabsTrigger>
          <TabsTrigger value="distribution">Task Distribution</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="risks">Risks & Blockers</TabsTrigger>
        </TabsList>

        {/* Burndown Chart */}
        <TabsContent value="burndown" className="space-y-4 overflow-x-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Burndown</CardTitle>
              <CardDescription>
                Tracking remaining story points over the sprint duration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full h-full">
                <ChartContainer
                  config={{
                    ideal: {
                      label: "Ideal Burndown",
                      color: "hsl(var(--chart-3))",
                    },
                    actual: {
                      label: "Actual Burndown",
                      color: "hsl(var(--chart-1))",
                    },
                    forecast: {
                      label: "Forecast",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={burndownData}
                      margin={{ top: 10, right: 40, left: 20, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorIdeal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-chart-3)"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-chart-3)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorActual"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        interval="preserveStartEnd"
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                      />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="ideal"
                        stroke="var(--color-chart-3)"
                        fillOpacity={1}
                        fill="url(#colorIdeal)"
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--color-chart-1)"
                        fillOpacity={1}
                        fill="url(#colorActual)"
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="var(--color-chart-5)"
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {totalPoints - completedPoints} points remaining
                  </span>
                </div>
                <div className="flex items-center">
                  {sprintProgress >= (daysRemaining / 14) * 100 ? (
                    <Badge
                      variant="outline"
                      className="border-chart-2 text-chart-2"
                    >
                      On Track
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-chart-5 text-chart-5"
                    >
                      Behind Schedule
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Distribution */}
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Type</CardTitle>
                <CardDescription>Distribution of tasks by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tasksByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {tasksByType.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`var(--color-chart-${(index % 5) + 1})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasks by Assignee</CardTitle>
                <CardDescription>
                  Distribution of tasks by team member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tasksByAssignee}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" name="Tasks">
                        {tasksByAssignee.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`var(--color-chart-${(index % 5) + 1})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>
                Tasks grouped by priority and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        priority: "High",
                        todo: sprintData.tasks.filter(
                          (t) => t.priority === "HIGH" && t.status === "TODO",
                        ).length,
                        inProgress: sprintData.tasks.filter(
                          (t) =>
                            t.priority === "HIGH" && t.status === "IN PROGRESS",
                        ).length,
                        done: sprintData.tasks.filter(
                          (t) => t.priority === "HIGH" && t.status === "DONE",
                        ).length,
                        blocked: sprintData.tasks.filter(
                          (t) =>
                            t.priority === "HIGH" && t.status === "BLOCKED",
                        ).length,
                      },
                      {
                        priority: "Medium",
                        todo: sprintData.tasks.filter(
                          (t) => t.priority === "MEDIUM" && t.status === "TODO",
                        ).length,
                        inProgress: sprintData.tasks.filter(
                          (t) =>
                            t.priority === "MEDIUM" &&
                            t.status === "IN PROGRESS",
                        ).length,
                        done: sprintData.tasks.filter(
                          (t) => t.priority === "MEDIUM" && t.status === "DONE",
                        ).length,
                        blocked: sprintData.tasks.filter(
                          (t) =>
                            t.priority === "MEDIUM" && t.status === "BLOCKED",
                        ).length,
                      },
                      {
                        priority: "Low",
                        todo: sprintData.tasks.filter(
                          (t) => t.priority === "LOW" && t.status === "TODO",
                        ).length,
                        inProgress: sprintData.tasks.filter(
                          (t) =>
                            t.priority === "LOW" && t.status === "IN PROGRESS",
                        ).length,
                        done: sprintData.tasks.filter(
                          (t) => t.priority === "LOW" && t.status === "DONE",
                        ).length,
                        blocked: sprintData.tasks.filter(
                          (t) => t.priority === "LOW" && t.status === "BLOCKED",
                        ).length,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="todo"
                      name="Todo"
                      stackId="a"
                      fill="var(--color-chart-3)"
                    />
                    <Bar
                      dataKey="inProgress"
                      name="In Progress"
                      stackId="a"
                      fill="var(--color-chart-1)"
                    />
                    <Bar
                      dataKey="done"
                      name="Done"
                      stackId="a"
                      fill="var(--color-chart-2)"
                    />
                    <Bar
                      dataKey="blocked"
                      name="Blocked"
                      stackId="a"
                      fill="var(--color-chart-5)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Velocity */}
        <TabsContent value="velocity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Velocity</CardTitle>
              <CardDescription>Story points completed per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={burndownData.map((day) => {
                      const prevDay = burndownData.find((d) => {
                        const prevDate = new Date(day.date);
                        prevDate.setDate(prevDate.getDate() - 1);
                        return d.date === prevDate.toISOString().split("T")[0];
                      });

                      const pointsDone = prevDay
                        ? Math.max(0, prevDay.actual - day.actual)
                        : 0;

                      return {
                        date: day.date,
                        pointsCompleted: pointsDone,
                      };
                    })}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="pointsCompleted"
                      name="Points Completed"
                      stroke="var(--color-chart-2)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">Average Velocity</div>
                    <div className="text-2xl font-bold mt-1">
                      {(
                        completedPoints / Math.max(1, 14 - daysRemaining)
                      ).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Points per day
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">
                      Estimated Completion
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {new Date(
                        new Date().getTime() +
                          ((totalPoints - completedPoints) /
                            Math.max(
                              0.1,
                              completedPoints / Math.max(1, 14 - daysRemaining),
                            )) *
                            24 *
                            60 *
                            60 *
                            1000,
                      ).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Based on current velocity
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Story Points by Status</CardTitle>
              <CardDescription>
                Distribution of story points across different statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Todo", value: velocityData.statusPoints.todo },
                        {
                          name: "In Progress",
                          value: velocityData.statusPoints.inProgress,
                        },
                        { name: "Done", value: velocityData.statusPoints.done },
                        {
                          name: "Blocked",
                          value: velocityData.statusPoints.blocked,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill="var(--color-chart-3)" />
                      <Cell fill="var(--color-chart-1)" />
                      <Cell fill="var(--color-chart-2)" />
                      <Cell fill="var(--color-chart-5)" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks & Blockers */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risks & Blockers</CardTitle>
              <CardDescription>
                Potential issues that may impact sprint completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sprintData.tasks.filter((t) => t.blocked).length > 0 ? (
                  sprintData.tasks
                    .filter((t) => t.blocked)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-2 p-3 border rounded-md bg-destructive/5"
                      >
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.storyPoints} points · Assigned to{" "}
                            {task.assignee}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="bg-destructive/10 text-destructive border-destructive/20"
                            >
                              Blocked
                            </Badge>
                            <Badge variant="outline">Due {task.dueDate}</Badge>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-12 w-12 text-chart-2 mb-4" />
                    <h3 className="text-lg font-medium">No Blockers</h3>
                    <p className="text-muted-foreground mt-1">
                      There are currently no blocked tasks in this sprint
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Risk Assessment</h3>
                  <div className="space-y-3">
                    {daysRemaining < 5 &&
                      totalPoints - completedPoints > daysRemaining * 2 && (
                        <div className="flex items-start gap-2 p-3 border rounded-md bg-chart-5/5">
                          <AlertCircle className="h-5 w-5 text-chart-5 mt-0.5" />
                          <div>
                            <h4 className="font-medium">
                              Sprint Scope at Risk
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Based on current velocity,{" "}
                              {totalPoints - completedPoints} remaining points
                              may not be completed within {daysRemaining} days
                            </p>
                          </div>
                        </div>
                      )}

                    {sprintData.tasks.filter(
                      (t) => t.priority === "HIGH" && t.status !== "DONE",
                    ).length > 0 && (
                      <div className="flex items-start gap-2 p-3 border rounded-md bg-chart-3/5">
                        <HelpCircle className="h-5 w-5 text-chart-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            High Priority Tasks Pending
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {
                              sprintData.tasks.filter(
                                (t) =>
                                  t.priority === "HIGH" && t.status !== "DONE",
                              ).length
                            }{" "}
                            high priority tasks are not yet completed
                          </p>
                        </div>
                      </div>
                    )}

                    {sprintData.tasks.filter(
                      (t) =>
                        new Date(t.dueDate) < new Date() && t.status !== "DONE",
                    ).length > 0 && (
                      <div className="flex items-start gap-2 p-3 border rounded-md bg-chart-1/5">
                        <Clock className="h-5 w-5 text-chart-1 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Overdue Tasks</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {
                              sprintData.tasks.filter(
                                (t) =>
                                  new Date(t.dueDate) < new Date() &&
                                  t.status !== "DONE",
                              ).length
                            }{" "}
                            tasks are past their due date
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Workload</CardTitle>
              <CardDescription>
                Distribution of work across team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksByAssignee.map((assignee) => {
                  const assigneeTasks = sprintData.tasks.filter(
                    (t) => t.assignee === assignee.name,
                  );
                  const totalAssigneePoints = assigneeTasks.reduce(
                    (sum, t) => sum + t.storyPoints,
                    0,
                  );
                  const completedAssigneePoints = assigneeTasks
                    .filter((t) => t.status === "DONE")
                    .reduce((sum, t) => sum + t.storyPoints, 0);
                  const workloadPercentage = Math.round(
                    (totalAssigneePoints / totalPoints) * 100,
                  );

                  return (
                    <div key={assignee.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{assignee.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {completedAssigneePoints}/{totalAssigneePoints} points
                          ({workloadPercentage}% of sprint)
                        </span>
                      </div>
                      <Progress
                        value={
                          (completedAssigneePoints / totalAssigneePoints) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
