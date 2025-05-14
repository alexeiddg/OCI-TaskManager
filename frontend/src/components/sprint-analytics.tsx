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
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
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
import { SprintHoursChart } from "@/components/total-hours-chart";
import { TeamMemberHoursChart } from "@/components/worked-hours-chart";
import { CompletedTasksChart } from "@/components/completed-tasks-chart";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { KpiDto } from "@/lib/types/DTO/model/KpiDto";
import { TeamKpiDto } from "@/lib/types/DTO/model/TeamKpiDtoSchema";
import { fetchKpiDto, fetchTeamKpiDto } from "@/server/api/kpi/getKpis";
import { SprintForAnalyticsModel } from "@/lib/types/DTO/helpers/SprintAnalyticsData";
import { fetchSprintAnalytics } from "@/server/api/sprint/getSprintAnalytics";
import { IconLoader } from "@tabler/icons-react";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";
import { TaskHoursTable } from "@/components/task-hours-table";

type Task = {
  id: string;
  title: string;
  type: string;
  status: TaskStatus;
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

const generateBurndownData = (sprint: SprintData) => {
  if (!sprint) {
    return [];
  }

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

  const actualBurndown = idealBurndown.map((day) => {
    const dayDate = new Date(day.date);

    const cumulativeCompletedPoints = sprint.tasks
      .filter((task) => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        const completedLocal = new Date(
          completedDate.getFullYear(),
          completedDate.getMonth(),
          completedDate.getDate(),
        );
        const dayLocal = new Date(
          dayDate.getFullYear(),
          dayDate.getMonth(),
          dayDate.getDate(),
        );
        return completedLocal.getTime() <= dayLocal.getTime();
      })
      .reduce((sum, task) => sum + task.storyPoints, 0);

    const remaining = totalStoryPoints - cumulativeCompletedPoints;

    return {
      ...day,
      actual: remaining,
    };
  });

  const today = new Date().toISOString().split("T")[0];
  let lastActual =
    actualBurndown.find((d) => d.date === today)?.actual ||
    (actualBurndown.length > 0
      ? actualBurndown[actualBurndown.length - 1].actual
      : 0);

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

const generateVelocityData = (sprint: SprintData) => {
  if (!sprint) {
    return {
      statusCounts: { todo: 0, inProgress: 0, done: 0, blocked: 0 },
      statusPoints: { todo: 0, inProgress: 0, done: 0, blocked: 0 },
    };
  }

  const statusCounts = {
    todo: sprint.tasks.filter((t) => t.status === TaskStatus.TODO && !t.blocked)
      .length,
    inProgress: sprint.tasks.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS && !t.blocked,
    ).length,
    done: sprint.tasks.filter(
      (t) => t.status === TaskStatus.DONE && t.completedAt,
    ).length,
    blocked: sprint.tasks.filter(
      (t) => t.blocked && t.status !== TaskStatus.DONE,
    ).length,
  };

  const statusPoints = {
    todo: sprint.tasks
      .filter((t) => t.status === TaskStatus.TODO && !t.blocked)
      .reduce((sum, t) => sum + t.storyPoints, 0),
    inProgress: sprint.tasks
      .filter((t) => t.status === TaskStatus.IN_PROGRESS && !t.blocked)
      .reduce((sum, t) => sum + t.storyPoints, 0),
    done: sprint.tasks
      .filter((t) => t.status === TaskStatus.DONE && t.completedAt)
      .reduce((sum, t) => sum + t.storyPoints, 0),
    blocked: sprint.tasks
      .filter((t) => t.blocked && t.status !== TaskStatus.DONE)
      .reduce((sum, t) => sum + t.storyPoints, 0),
  };
  return { statusCounts, statusPoints };
};

export function SprintAnalyticsDashboard() {
  // backend fetches
  const { data: session } = useSession();
  const [kpis, setKpis] = useState<KpiDto | null>(null);
  const [teamKpis, setTeamKpis] = useState<TeamKpiDto | null>(null);
  const [sprintAnalyticsData, setSprintAnalyticsData] =
    useState<SprintForAnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSprint, setSelectedSprint] = useState<string>("");
  const userId = Number(session?.user?.id);
  const teamId = Number(session?.user?.teamId);

  const [sprintDataFormatted, setSprintDataFormatted] =
    useState<SprintData | null>(null);

  const burndownData = React.useMemo(
    () =>
      generateBurndownData(
        sprintDataFormatted || {
          id: "",
          name: "",
          startDate: "",
          endDate: "",
          tasks: [],
          goal: "",
        },
      ),
    [sprintDataFormatted],
  );

  const velocityData = React.useMemo(
    () =>
      generateVelocityData(
        sprintDataFormatted || {
          id: "",
          name: "",
          startDate: "",
          endDate: "",
          tasks: [],
          goal: "",
        },
      ),
    [sprintDataFormatted],
  );

  const tasksByType = React.useMemo(() => {
    if (!sprintDataFormatted) return [];

    const counts: Record<string, number> = {};

    sprintDataFormatted.tasks.forEach((t) => {
      const type = t.type.toUpperCase();
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts).map(([type, value]) => ({
      name: type,
      value,
    }));
  }, [sprintDataFormatted]);

  const tasksByAssignee = React.useMemo(() => {
    if (!sprintDataFormatted) return [];

    const assignees = [
      ...new Set(
        sprintDataFormatted.tasks
          .map((t) => t.assignee)
          .filter(Boolean) as string[],
      ),
    ];
    return assignees.map((assignee) => ({
      name: assignee,
      value: sprintDataFormatted.tasks.filter((t) => t.assignee === assignee)
        .length,
    }));
  }, [sprintDataFormatted]);

  useEffect(() => {
    setLoading(true);
    fetchKpiDto(userId)
      .then((data) => {
        setKpis(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch KPIs", err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    fetchTeamKpiDto(userId)
      .then((teamData) => {
        setTeamKpis(teamData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch KPIs", err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    fetchSprintAnalytics(teamId)
      .then((sprintAnalytics) => {
        setSprintAnalyticsData(sprintAnalytics);
        if (sprintAnalytics) {
          setSelectedSprint(sprintAnalytics.id.toString());

          const formattedData: SprintData = {
            id: sprintAnalytics.id.toString(),
            name: sprintAnalytics.sprintName,
            startDate: sprintAnalytics.startDate.toISOString().split("T")[0],
            endDate: sprintAnalytics.endDate.toISOString().split("T")[0],
            goal:
              sprintAnalytics.sprintDescription || "No description provided",
            tasks: sprintAnalytics.tasks.map((task) => ({
              id: task.id.toString(),
              title: task.taskName,
              type: task.type,
              status: task.status,
              priority: task.priority,
              storyPoints: task.storyPoints,
              sprint: sprintAnalytics.sprintName,
              dueDate: task.dueDate.toISOString().split("T")[0],
              blocked: task.blocked,
              assignee: task.assignee ? task.assignee.name : undefined,
              createdAt: task.createdAt.toISOString().split("T")[0],
              completedAt: task.completedAt
                ? task.completedAt.toISOString().split("T")[0]
                : undefined,
            })),
          };
          setSprintDataFormatted(formattedData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sprint analytics", err);
        setLoading(false);
      });
  }, [teamId]);

  if (
    loading ||
    !sprintAnalyticsData ||
    !kpis ||
    !teamKpis ||
    !sprintDataFormatted
  ) {
    return (
      <Card className="@container/card mx-4 lg:mx-6 my-6">
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <span className="my-2">Please wait while we load your analytics</span>
          <IconLoader className="animate-spin size-6 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const totalTasks = sprintDataFormatted.tasks.length;
  const completedTasks = sprintDataFormatted.tasks.filter(
    (t) => t.status === TaskStatus.DONE && t.completedAt,
  ).length;
  const totalPoints = sprintDataFormatted.tasks.reduce(
    (sum, t) => sum + t.storyPoints,
    0,
  );
  const completedPoints = sprintDataFormatted.tasks
    .filter((t) => t.status === TaskStatus.DONE && t.completedAt)
    .reduce((sum, t) => sum + t.storyPoints, 0);
  const sprintProgress = Math.round((completedPoints / totalPoints) * 100) || 0;

  const today = new Date();
  const endDate = new Date(sprintDataFormatted.endDate);
  const daysRemaining = Math.max(
    0,
    Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <div className="space-y-4 mx-6 my-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {sprintDataFormatted.name} Analytics
          </h2>
          <p className="text-muted-foreground">{sprintDataFormatted.goal}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedSprint} onValueChange={setSelectedSprint}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={sprintDataFormatted.id}>
                {sprintDataFormatted.name}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {sprintDataFormatted.startDate} - {sprintDataFormatted.endDate}
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
            <div className="text-2xl font-bold">
              {((completedPoints / totalPoints) * 100).toFixed(1)}%
            </div>
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
              {((completedPoints / totalPoints) * 100).toFixed(1)}% of points
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
                Sprint ends on {sprintDataFormatted.endDate}
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

      <div className="w-full relative overflow-visible">
        <Tabs defaultValue="burndown">
          <TabsList
              className="relative z-10 bg-background p-2 flex flex-wrap gap-2 lg:gap-1 my-4 justify-center sm:justify-start lg:flex-nowrap lg:justify-start"
          >
            <TabsTrigger className="whitespace-nowrap text-sm" value="burndown">Burndown Chart</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="distribution">Task Distribution</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="velocity">Velocity</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="risks">Risks & Blockers</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="personal">Personal KPIs</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="team">Team KPIs</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="sprintHours">Sprint Hours</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="teamHours">Team Hours</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="sprintTasks">Tasks Completed</TabsTrigger>
            <TabsTrigger className="whitespace-nowrap text-sm" value="HoursTracking">Hours Tracking</TabsTrigger>
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
                    {(() => {
                      const isSprintComplete = totalPoints === completedPoints;
                      const isBehindSchedule =
                        !isSprintComplete &&
                        completedPoints / totalPoints <
                          (14 - daysRemaining) / 14;

                      return isBehindSchedule ? (
                        <Badge
                          variant="outline"
                          className="border-chart-5 text-chart-5"
                        >
                          Behind Schedule
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-chart-2 text-chart-2"
                        >
                          On Track
                        </Badge>
                      );
                    })()}
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
                  <CardDescription>
                    Distribution of tasks by type
                  </CardDescription>
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
                          todo: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "HIGH" &&
                              t.status === TaskStatus.TODO,
                          ).length,
                          inProgress: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "HIGH" &&
                              t.status === TaskStatus.IN_PROGRESS,
                          ).length,
                          done: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "HIGH" &&
                              t.status === TaskStatus.DONE,
                          ).length,
                          blocked: sprintDataFormatted.tasks.filter(
                            (t) => t.priority === "HIGH" && t.blocked,
                          ).length,
                        },
                        {
                          priority: "Medium",
                          todo: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "MEDIUM" &&
                              t.status === TaskStatus.TODO,
                          ).length,
                          inProgress: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "MEDIUM" &&
                              t.status === TaskStatus.IN_PROGRESS,
                          ).length,
                          done: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "MEDIUM" &&
                              t.status === TaskStatus.DONE,
                          ).length,
                          blocked: sprintDataFormatted.tasks.filter(
                            (t) => t.priority === "MEDIUM" && t.blocked,
                          ).length,
                        },
                        {
                          priority: "Low",
                          todo: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "LOW" &&
                              t.status === TaskStatus.TODO,
                          ).length,
                          inProgress: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "LOW" &&
                              t.status === TaskStatus.IN_PROGRESS,
                          ).length,
                          done: sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "LOW" &&
                              t.status === TaskStatus.DONE,
                          ).length,
                          blocked: sprintDataFormatted.tasks.filter(
                            (t) => t.priority === "LOW" && t.blocked,
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
            <ChartAreaInteractive />

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
                          {
                            name: "Todo",
                            value: velocityData.statusPoints.todo,
                          },
                          {
                            name: "In Progress",
                            value: velocityData.statusPoints.inProgress,
                          },
                          {
                            name: "Done",
                            value: velocityData.statusPoints.done,
                          },
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
                  {sprintDataFormatted.tasks.filter((t) => t.blocked).length >
                  0 ? (
                    sprintDataFormatted.tasks
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
                              <Badge variant="outline">
                                Due {task.dueDate}
                              </Badge>
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

                      {sprintDataFormatted.tasks.filter(
                        (t) =>
                          t.priority === "HIGH" && t.status !== TaskStatus.DONE,
                      ).length > 0 && (
                        <div className="flex items-start gap-2 p-3 border rounded-md bg-chart-3/5">
                          <HelpCircle className="h-5 w-5 text-chart-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium">
                              High Priority Tasks Pending
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {
                                sprintDataFormatted.tasks.filter(
                                  (t) =>
                                    t.priority === "HIGH" &&
                                    t.status !== TaskStatus.DONE,
                                ).length
                              }{" "}
                              high priority tasks are not yet completed
                            </p>
                          </div>
                        </div>
                      )}

                      {sprintDataFormatted.tasks.filter(
                        (t) =>
                          new Date(t.dueDate) < new Date() &&
                          t.status !== TaskStatus.DONE,
                      ).length > 0 && (
                        <div className="flex items-start gap-2 p-3 border rounded-md bg-chart-1/5">
                          <Clock className="h-5 w-5 text-chart-1 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Overdue Tasks</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {
                                sprintDataFormatted.tasks.filter(
                                  (t) =>
                                    new Date(t.dueDate) < new Date() &&
                                    t.status !== TaskStatus.DONE,
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
                    const assigneeTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.assignee === assignee.name,
                    );
                    const totalAssigneePoints = assigneeTasks.reduce(
                      (sum, t) => sum + t.storyPoints,
                      0,
                    );
                    const completedAssigneePoints = assigneeTasks
                      .filter(
                        (t) => t.status === TaskStatus.DONE && t.completedAt,
                      )
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
                            {completedAssigneePoints}/{totalAssigneePoints}{" "}
                            points ({workloadPercentage}% of sprint)
                          </span>
                        </div>
                        <Progress
                          value={
                            (completedAssigneePoints / totalAssigneePoints) *
                            100
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

          {/* Personal KPIs */}
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Personal Sprint Velocity
                  </CardTitle>
                  <CardDescription>
                    Story points completed by you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const userTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.assignee === session?.user?.name,
                    );
                    const userCompletedPoints = userTasks
                      .filter(
                        (t) => t.status === TaskStatus.DONE && t.completedAt,
                      )
                      .reduce((sum, t) => sum + t.storyPoints, 0);
                    const userTotalPoints = userTasks.reduce(
                      (sum, t) => sum + t.storyPoints,
                      0,
                    );

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {userCompletedPoints} points
                        </div>
                        <Progress
                          value={
                            (userCompletedPoints /
                              Math.max(1, userTotalPoints)) *
                            100
                          }
                          className="h-2 mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {Math.round(
                            (userCompletedPoints /
                              Math.max(1, userTotalPoints)) *
                              100,
                          )}
                          % of your assigned points completed
                        </p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Personal Completion Rate
                  </CardTitle>
                  <CardDescription>
                    Percentage of your tasks completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const userTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.assignee === session?.user?.name,
                    );
                    const userCompletedTasks = userTasks.filter(
                      (t) => t.status === TaskStatus.DONE && t.completedAt,
                    ).length;
                    const completionRate =
                      (userCompletedTasks / Math.max(1, userTasks.length)) *
                      100;

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {Math.round(completionRate)}%
                        </div>
                        <Progress value={completionRate} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          {userCompletedTasks} of {userTasks.length} tasks
                          completed
                        </p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Efficiency Score
                  </CardTitle>
                  <CardDescription>
                    Story points per hour (estimated)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {kpis.efficiency.toFixed(2)}
                        </div>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            Based on your average logged hours
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Completion Time
                  </CardTitle>
                  <CardDescription>
                    Average days to complete tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const userTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.assignee === session?.user?.name,
                    );
                    const completedTasks = userTasks.filter(
                      (t) => t.status === TaskStatus.DONE && t.completedAt,
                    );

                    const completionTimes = completedTasks.map((task) => {
                      const createdDate = new Date(task.createdAt);
                      const completedDate = new Date(task.completedAt!);
                      return (
                        (completedDate.getTime() - createdDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                      ); // days
                    });

                    const avgCompletionTime =
                      completionTimes.length > 0
                        ? completionTimes.reduce((sum, time) => sum + time, 0) /
                          completionTimes.length
                        : 0;

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {avgCompletionTime.toFixed(1)} days
                        </div>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            Based on {completedTasks.length} completed tasks
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bugs vs Features Ratio
                  </CardTitle>
                  <CardDescription>
                    Balance of bug fixes to features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const bugTasks = kpis.taskTypeBreakdown?.bugs || 0;
                    const featureTasks = kpis.taskTypeBreakdown?.features || 0;

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {kpis.bugsVsFeatures.toFixed(2)}
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-chart-5 mr-1"></span>
                            <span>Bugs: {bugTasks}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-chart-2 mr-1"></span>
                            <span>Features: {featureTasks}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Workload Balance
                  </CardTitle>
                  <CardDescription>
                    Your workload vs team average
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const userStoryPoints = sprintDataFormatted.tasks
                      .filter((t) => t.assignee === session?.user?.name)
                      .reduce((sum, t) => sum + t.storyPoints, 0);

                    const assignees = [
                      ...new Set(
                        sprintDataFormatted.tasks
                          .map((t) => t.assignee)
                          .filter(Boolean),
                      ),
                    ];
                    const avgTeamPoints =
                      totalPoints / Math.max(1, assignees.length);
                    const workloadRatio =
                      userStoryPoints / Math.max(1, avgTeamPoints);

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {workloadRatio.toFixed(2)}x
                        </div>
                        <Progress
                          value={Math.min(workloadRatio * 50, 100)}
                          className={`h-2 mt-2 ${workloadRatio > 1.2 ? "bg-chart-5" : ""}`}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {userStoryPoints} points vs {avgTeamPoints.toFixed(1)}{" "}
                          team average
                        </p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk & Blocker Indicators</CardTitle>
                  <CardDescription>
                    Personal risk factors for this sprint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const userTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.assignee === session?.user?.name,
                    );

                    const blockedTasks = userTasks.filter(
                      (t) => t.blocked,
                    ).length;
                    const highPriorityPending = userTasks.filter(
                      (t) =>
                        t.priority === "HIGH" && t.status !== TaskStatus.DONE,
                    ).length;
                    const overdueTasks = userTasks.filter(
                      (t) =>
                        new Date(t.dueDate) < new Date() &&
                        t.status !== TaskStatus.DONE,
                    ).length;

                    const userTotalPoints = userTasks.reduce(
                      (sum, t) => sum + t.storyPoints,
                      0,
                    );
                    const userCompletedPoints = userTasks
                      .filter(
                        (t) => t.status === TaskStatus.DONE && t.completedAt,
                      )
                      .reduce((sum, t) => sum + t.storyPoints, 0);
                    const userRemainingPoints =
                      userTotalPoints - userCompletedPoints;
                    const userDaysElapsed = 14 - daysRemaining;
                    const userAvgVelocity =
                      userCompletedPoints / Math.max(1, userDaysElapsed);
                    const scopeAtRisk =
                      userRemainingPoints > userAvgVelocity * daysRemaining;

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col p-3 border rounded-md">
                            <div className="text-sm font-medium">
                              Blocked Tasks
                            </div>
                            <div className="text-2xl font-bold mt-1">
                              {blockedTasks}
                            </div>
                            <Badge
                              variant="outline"
                              className={`mt-2 w-fit ${blockedTasks > 0 ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                            >
                              {blockedTasks > 0 ? "Action Needed" : "All Clear"}
                            </Badge>
                          </div>

                          <div className="flex flex-col p-3 border rounded-md">
                            <div className="text-sm font-medium">
                              High Priority Pending
                            </div>
                            <div className="text-2xl font-bold mt-1">
                              {highPriorityPending}
                            </div>
                            <Badge
                              variant="outline"
                              className={`mt-2 w-fit ${highPriorityPending > 1 ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                            >
                              {highPriorityPending > 1
                                ? "Attention Required"
                                : "On Track"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col p-3 border rounded-md">
                            <div className="text-sm font-medium">
                              Overdue Tasks
                            </div>
                            <div className="text-2xl font-bold mt-1">
                              {overdueTasks}
                            </div>
                            <Badge
                              variant="outline"
                              className={`mt-2 w-fit ${overdueTasks > 0 ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                            >
                              {overdueTasks > 0 ? "Past Due" : "On Schedule"}
                            </Badge>
                          </div>

                          <div className="flex flex-col p-3 border rounded-md">
                            <div className="text-sm font-medium">
                              Sprint Scope
                            </div>
                            <div className="text-2xl font-bold mt-1">
                              {userRemainingPoints} points left
                            </div>
                            <Badge
                              variant="outline"
                              className={`mt-2 w-fit ${scopeAtRisk ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                            >
                              {scopeAtRisk ? "At Risk" : "Achievable"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contextual Metrics & Insights</CardTitle>
                  <CardDescription>
                    Additional personal performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const userTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.assignee === session?.user?.name,
                    );
                    const userTotalPoints = userTasks.reduce(
                      (sum, t) => sum + t.storyPoints,
                      0,
                    );
                    const userCompletedPoints = userTasks
                      .filter(
                        (t) => t.status === TaskStatus.DONE && t.completedAt,
                      )
                      .reduce((sum, t) => sum + t.storyPoints, 0);
                    const percentTimeElapsed = Math.round(
                      ((14 - daysRemaining) / 14) * 100,
                    );
                    const percentWorkCompleted = Math.round(
                      (userCompletedPoints / Math.max(1, userTotalPoints)) *
                        100,
                    );
                    const featurePoints = userTasks
                      .filter(
                        (t) =>
                          t.type === "FEATURE" &&
                          t.status === TaskStatus.DONE &&
                          t.completedAt,
                      )
                      .reduce((sum, t) => sum + t.storyPoints, 0);
                    const focusScore =
                      (featurePoints / Math.max(1, userCompletedPoints)) * 100;

                    return (
                      <div className="space-y-4">
                        <div className="flex flex-col p-3 border rounded-md">
                          <div className="text-sm font-medium">
                            Time Logged This Sprint (Average)
                          </div>
                          <div className="text-2xl font-bold mt-1">
                            {kpis.averageLoggedHours.toFixed(1)} hours
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Based on your average logged hours
                          </div>
                        </div>

                        <div className="flex flex-col p-3 border rounded-md">
                          <div className="text-sm font-medium">
                            Progress Forecast
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">
                              {Math.round(percentTimeElapsed)}% time elapsed
                            </span>
                            <span className="text-sm">
                              {Math.round(percentWorkCompleted)}% work completed
                            </span>
                          </div>
                          <Progress
                            value={percentWorkCompleted}
                            className="h-2 mt-2"
                          />
                          <Badge
                            variant="outline"
                            className={`mt-2 w-fit ${percentWorkCompleted <= percentTimeElapsed ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                          >
                            {percentWorkCompleted <= percentTimeElapsed
                              ? "Behind Schedule"
                              : "Ahead of Schedule"}
                          </Badge>
                        </div>

                        <div className="flex flex-col p-3 border rounded-md">
                          <div className="text-sm font-medium">Focus Score</div>
                          <div className="text-2xl font-bold mt-1">
                            {Math.round(focusScore)}%
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(focusScore)}% of your completed work is
                            feature development
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Task Distribution by Type</CardTitle>
                <CardDescription>
                  Breakdown of your assigned tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {(() => {
                    const taskTypeBreakdown = kpis.taskTypeBreakdown || {};
                    const taskDistribution = Object.entries(
                      taskTypeBreakdown,
                    ).map(([name, value]) => ({
                      name,
                      value,
                    }));

                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={taskDistribution}
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
                            {taskDistribution.map((entry, index) => (
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
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team KPIs */}
          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Sprint Velocity
                  </CardTitle>
                  <CardDescription>
                    Total story points completed by team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {completedPoints} points
                  </div>
                  <Progress
                    value={(completedPoints / totalPoints) * 100}
                    className="h-2 mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round((completedPoints / totalPoints) * 100)}% of
                    total points completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Completion Rate
                  </CardTitle>
                  <CardDescription>
                    Percentage of all sprint tasks completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((completedTasks / totalTasks) * 100)}%
                  </div>
                  <Progress
                    value={(completedTasks / totalTasks) * 100}
                    className="h-2 mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Efficiency Score
                  </CardTitle>
                  <CardDescription>
                    Team&#39;s average story points per hour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {teamKpis.averageEfficiency.toFixed(2)}
                        </div>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            Based on ~{teamKpis.totalTimeLogged} team hours
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Completion Time
                  </CardTitle>
                  <CardDescription>
                    Average days to complete tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const completedTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.status === TaskStatus.DONE && t.completedAt,
                    );

                    const completionTimes = completedTasks.map((task) => {
                      const createdDate = new Date(task.createdAt);
                      const completedDate = new Date(task.completedAt!);
                      return (
                        (completedDate.getTime() - createdDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                      ); // days
                    });

                    const avgCompletionTime =
                      completionTimes.length > 0
                        ? completionTimes.reduce((sum, time) => sum + time, 0) /
                          completionTimes.length
                        : 0;

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {avgCompletionTime.toFixed(1)} days
                        </div>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            Based on {completedTasks.length} completed tasks
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Bug:Feature Ratio
                  </CardTitle>
                  <CardDescription>
                    Balance of bug fixes to features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const bugTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.type === "BUG",
                    ).length;
                    const featureTasks = sprintDataFormatted.tasks.filter(
                      (t) => t.type === "FEATURE",
                    ).length;
                    const ratio =
                      featureTasks > 0 ? bugTasks / featureTasks : bugTasks;

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {ratio.toFixed(2)}
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-chart-5 mr-1"></span>
                            <span>Bugs: {bugTasks}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-chart-2 mr-1"></span>
                            <span>Features: {featureTasks}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Workload Balance Score
                  </CardTitle>
                  <CardDescription>
                    Distribution of work across team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const assignees = [
                      ...new Set(
                        sprintDataFormatted.tasks
                          .map((t) => t.assignee)
                          .filter(Boolean),
                      ),
                    ];
                    const assigneePoints = assignees.map((assignee) => {
                      return sprintDataFormatted.tasks
                        .filter((t) => t.assignee === assignee)
                        .reduce((sum, t) => sum + t.storyPoints, 0);
                    });

                    const avgPoints = totalPoints / assignees.length;
                    const variance =
                      assigneePoints.reduce(
                        (sum, points) => sum + Math.pow(points - avgPoints, 2),
                        0,
                      ) / assignees.length;
                    const stdDev = Math.sqrt(variance);

                    const balanceScore = Math.max(0, 1 - stdDev / avgPoints);

                    return (
                      <>
                        <div className="text-2xl font-bold">
                          {balanceScore.toFixed(2)}
                        </div>
                        <Progress
                          value={balanceScore * 100}
                          className="h-2 mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {balanceScore > 0.8
                            ? "Well balanced"
                            : balanceScore > 0.5
                              ? "Moderately balanced"
                              : "Imbalanced"}{" "}
                          workload
                        </p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Risk Indicators</CardTitle>
                  <CardDescription>
                    Team-wide risk factors for this sprint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="text-sm font-medium">
                          Blocked Tasks (Team)
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {velocityData.statusCounts.blocked}
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-2 w-fit ${velocityData.statusCounts.blocked > 0 ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                        >
                          {velocityData.statusCounts.blocked > 0
                            ? "Action Needed"
                            : "All Clear"}
                        </Badge>
                      </div>

                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="text-sm font-medium">
                          High Priority Pending
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {
                            sprintDataFormatted.tasks.filter(
                              (t) =>
                                t.priority === "HIGH" &&
                                t.status !== TaskStatus.DONE,
                            ).length
                          }
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-2 w-fit ${sprintDataFormatted.tasks.filter((t) => t.priority === "HIGH" && t.status !== TaskStatus.DONE).length > 2 ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                        >
                          {sprintDataFormatted.tasks.filter(
                            (t) =>
                              t.priority === "HIGH" &&
                              t.status !== TaskStatus.DONE,
                          ).length > 2
                            ? "Attention Required"
                            : "On Track"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="text-sm font-medium">Overdue Tasks</div>
                        <div className="text-2xl font-bold mt-1">
                          {
                            sprintDataFormatted.tasks.filter(
                              (t) =>
                                new Date(t.dueDate) < new Date() &&
                                t.status !== TaskStatus.DONE,
                            ).length
                          }
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-2 w-fit ${sprintDataFormatted.tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.DONE).length > 0 ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                        >
                          {sprintDataFormatted.tasks.filter(
                            (t) =>
                              new Date(t.dueDate) < new Date() &&
                              t.status !== TaskStatus.DONE,
                          ).length > 0
                            ? "Past Due"
                            : "On Schedule"}
                        </Badge>
                      </div>

                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="text-sm font-medium">Sprint Scope</div>
                        <div className="text-2xl font-bold mt-1">
                          {totalPoints - completedPoints} points left
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-2 w-fit ${totalPoints - completedPoints > daysRemaining * (completedPoints / (14 - daysRemaining)) ? "border-chart-5 text-chart-5" : "border-chart-2 text-chart-2"}`}
                        >
                          {totalPoints - completedPoints >
                          daysRemaining *
                            (completedPoints / (14 - daysRemaining))
                            ? "At Risk"
                            : "Achievable"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Contextual Metrics</CardTitle>
                  <CardDescription>
                    Additional team performance insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col p-3 border rounded-md">
                      <div className="text-sm font-medium">
                        Time Logged This Sprint (Total)
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {teamKpis.totalTimeLogged} hours
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Based on team&#39;s logged work
                      </div>
                    </div>

                    <div className="flex flex-col p-3 border rounded-md">
                      <div className="text-sm font-medium">
                        Progress Forecast (Team)
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">
                          {Math.round(((14 - daysRemaining) / 14) * 100)}% time
                          elapsed
                        </span>
                        <span className="text-sm">
                          {Math.round((completedPoints / totalPoints) * 100)}%
                          work completed
                        </span>
                      </div>
                      <Progress
                        value={(completedPoints / totalPoints) * 100}
                        className="h-2 mt-2"
                      />
                      <Badge
                        variant="outline"
                        className={`mt-2 w-fit ${(completedPoints / totalPoints) * 100 >= ((14 - daysRemaining) / 14) * 100 ? "border-chart-2 text-chart-2" : "border-chart-5 text-chart-5"}`}
                      >
                        {(completedPoints / totalPoints) * 100 >=
                        ((14 - daysRemaining) / 14) * 100
                          ? "Ahead of Schedule"
                          : "Behind Schedule"}
                      </Badge>
                    </div>

                    <div className="flex flex-col p-3 border rounded-md">
                      <div className="text-sm font-medium">
                        Focus Score (Team)
                      </div>
                      {(() => {
                        const featurePoints = sprintDataFormatted.tasks
                          .filter(
                            (t) =>
                              t.type === "FEATURE" &&
                              t.status === TaskStatus.DONE &&
                              t.completedAt,
                          )
                          .reduce((sum, t) => sum + t.storyPoints, 0);
                        const focusScore =
                          (featurePoints / Math.max(1, completedPoints)) * 100;

                        return (
                          <>
                            <div className="text-2xl font-bold mt-1">
                              {Math.round(focusScore)}%
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {Math.round(focusScore)}% of completed work is
                              feature development
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>
                  Team members with highest performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const assignees = [
                      ...new Set(
                        sprintDataFormatted.tasks
                          .map((t) => t.assignee)
                          .filter(Boolean) as string[],
                      ),
                    ];

                    const teamMetrics = assignees.map((assignee) => {
                      const assigneeTasks = sprintDataFormatted.tasks.filter(
                        (t) => t.assignee === assignee,
                      );
                      const completedTasks = assigneeTasks.filter(
                        (t) => t.status === TaskStatus.DONE && t.completedAt,
                      );
                      const completedPoints = completedTasks.reduce(
                        (sum, t) => sum + t.storyPoints,
                        0,
                      );
                      const featureTasks = completedTasks.filter(
                        (t) => t.type === "FEATURE",
                      );
                      const featurePoints = featureTasks.reduce(
                        (sum, t) => sum + t.storyPoints,
                        0,
                      );

                      return {
                        name: assignee,
                        completedTasks: completedTasks.length,
                        completedPoints,
                        featurePoints,
                        efficiency:
                          completedPoints / (assigneeTasks.length || 1),
                      };
                    });

                    const sortedByPoints = [...teamMetrics].sort(
                      (a, b) => b.completedPoints - a.completedPoints,
                    );
                    const topContributor = sortedByPoints[0];

                    const sortedByEfficiency = [...teamMetrics].sort(
                      (a, b) => b.efficiency - a.efficiency,
                    );
                    const mostEfficient = sortedByEfficiency[0];

                    const sortedByFeatures = [...teamMetrics].sort(
                      (a, b) => b.featurePoints - a.featurePoints,
                    );
                    const topFeatureContributor = sortedByFeatures[0];

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col p-3 border rounded-md">
                          <div className="text-sm font-medium">
                            Most Productive
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {topContributor?.name || "N/A"}
                          </div>
                          <div className="text-sm mt-1">
                            {topContributor?.completedPoints || 0} points
                            completed
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {topContributor?.completedTasks || 0} tasks
                            completed
                          </div>
                        </div>

                        <div className="flex flex-col p-3 border rounded-md">
                          <div className="text-sm font-medium">
                            Most Efficient
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {mostEfficient?.name || "N/A"}
                          </div>
                          <div className="text-sm mt-1">
                            {mostEfficient?.efficiency.toFixed(1) || "0.0"}{" "}
                            points per task
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Highest ratio of points to assigned tasks
                          </div>
                        </div>

                        <div className="flex flex-col p-3 border rounded-md">
                          <div className="text-sm font-medium">
                            Feature Champion
                          </div>
                          <div className="text-xl font-bold mt-1">
                            {topFeatureContributor?.name || "N/A"}
                          </div>
                          <div className="text-sm mt-1">
                            {topFeatureContributor?.featurePoints || 0} feature
                            points
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Highest contribution to feature development
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprint Hours */}
          <TabsContent value="sprintHours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sprint Hours</CardTitle>
                <CardDescription>
                  Total logged hours for this sprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SprintHoursChart />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Hours */}
          <TabsContent value="teamHours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Hours</CardTitle>
                <CardDescription>
                  Worked hours by each team member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamMemberHoursChart />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprint Tasks */}
          <TabsContent value="sprintTasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>
                  Overview of task completion during the sprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompletedTasksChart />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Hours Table */}
          <TabsContent value="HoursTracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Hours Tracking</CardTitle>
                <CardDescription>
                  Comparison of estimated vs actual hours for sprint tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskHoursTable/>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
