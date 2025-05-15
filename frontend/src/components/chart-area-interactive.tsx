"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useSession } from "next-auth/react";
import { IconLoader } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchTeamMembers } from "@/server/api/task/createTaskHelpers";
import { fetchTasksByUserId } from "@/server/api/task/getTask";
import type { TaskModel } from "@/lib/types/DTO/model/Task";
import type { AppUserDto } from "@/lib/types/DTO/model/AppUserDto";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";

type ChartDataPoint = {
  date: string;
  [username: string]: number | string;
};

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<AppUserDto[]>([]);
  const [tasksData, setTasksData] = useState<TaskModel[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [userColors, setUserColors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  useEffect(() => {
    const teamId = session?.user?.teamId;
    if (!teamId) return;

    setLoading(true);

    fetchTeamMembers(teamId.toString())
      .then(async (members) => {
        setTeamMembers(members);

        const colors: Record<string, string> = {};
        const baseColors = [
          "var(--chart-1)",
          "var(--chart-2)",
          "var(--chart-3)",
          "var(--chart-4)",
          "var(--chart-5)",
        ];

        members.forEach((member, index) => {
          colors[member.name] = baseColors[index % baseColors.length];
        });
        setUserColors(colors);

        const allTasks: TaskModel[] = [];
        for (const member of members) {
          try {
            const tasks = await fetchTasksByUserId(member.id);
            allTasks.push(...tasks);
          } catch (error) {
            console.error(
              `Failed to fetch tasks for user ${member.id}:`,
              error,
            );
          }
        }

        setTasksData(allTasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch team members:", error);
        setLoading(false);
      });
  }, [session]);

  useEffect(() => {
    if (tasksData.length === 0) return;
    const tasksByDate: Record<string, Record<string, number>> = {};

    // Create a mapping from username to team member name
    const usernameToNameMap: Record<string, string> = {};

    // For each team member, find all tasks assigned to them
    teamMembers.forEach((member) => {
      tasksData.forEach((task) => {
        if (task.assignedToUsername) {
          // Try multiple matching strategies to ensure robust mapping
          const memberNameNoSpaces = member.name.replace(/\s+/g, "");
          const usernameNoSpaces = task.assignedToUsername.replace(/\s+/g, "");

          // Strategy 1: Check if username contains member name without spaces
          if (usernameNoSpaces.includes(memberNameNoSpaces)) {
            usernameToNameMap[task.assignedToUsername] = member.name;
          }
          // Strategy 2: Check if member name contains username without spaces
          else if (memberNameNoSpaces.includes(usernameNoSpaces)) {
            usernameToNameMap[task.assignedToUsername] = member.name;
          }
          // Strategy 3: Check for partial matches (e.g., "Alexei" in "AlexeiManager")
          else if (member.name.split(" ").some(namePart =>
            task.assignedToUsername?.includes(namePart) ||
            task.assignedToUsername?.includes(namePart.replace(/\s+/g, ""))
          )) {
            usernameToNameMap[task.assignedToUsername] = member.name;
          }
        }
      });
    });

    tasksData.forEach((task) => {
      if (
        (task.status === TaskStatus.DONE || task.completed) &&
        task.assignedToUsername
      ) {
        // Use completedAt if available, otherwise use createdAt if task is completed
        const completionDate = task.completedAt || (task.completed ? task.createdAt : null);
        if (!completionDate) {
          console.log("Task has no completion date:", task);
          return;
        }

        const completedDate = new Date(completionDate)
          .toISOString()
          .split("T")[0];
        if (!tasksByDate[completedDate]) {
          tasksByDate[completedDate] = {};
        }

        if (!tasksByDate[completedDate][task.assignedToUsername]) {
          tasksByDate[completedDate][task.assignedToUsername] = 0;
        }

        tasksByDate[completedDate][task.assignedToUsername]++;
      }
    });

    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setDate(today.getDate() - 90);

    const allDates: string[] = [];
    const currentDate = new Date(threeMonthsAgo);

    while (currentDate <= today) {
      allDates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartDataArray = allDates.map((date) => {
      const dataPoint: ChartDataPoint = { date };

      teamMembers.forEach((member) => {
        // Find all usernames that map to this team member
        const usernames = Object.entries(usernameToNameMap)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, name]) => name === member.name)
          .map(([username]) => username);

        let totalTasks = 0;

        if (tasksByDate[date]) {
          // Sum up tasks for all usernames that map to this team member
          usernames.forEach((username) => {
            totalTasks += tasksByDate[date][username] || 0;
          });

          // If no usernames map to this team member, try using the member name directly
          if (usernames.length === 0) {
            totalTasks = tasksByDate[date][member.name] || 0;
          }
        }

        dataPoint[member.name] = totalTasks;
      });

      return dataPoint;
    });

    setChartData(chartDataArray);
  }, [tasksData, teamMembers]);

  const dynamicChartConfig = React.useMemo(() => {
    const config: ChartConfig = { tasks: { label: "Tasks Completed" } };

    teamMembers.forEach((member) => {
      config[member.name] = {
        label: member.name,
        color: userColors[member.name] || "var(--primary)",
      };
    });

    return config;
  }, [teamMembers, userColors]);

  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let daysToSubtract = 90;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);

    const filtered = chartData.filter((item) => {
      const date = new Date(item.date);
      date.setHours(0, 0, 0, 0);
      return date >= startDate && date <= today;
    });

    return filtered;
  }, [chartData, timeRange]);

  if (loading) {
    return (
      <Card className="@container/card">
        <CardContent className="flex items-center justify-center h-[300px]">
          <IconLoader className="animate-spin size-6 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tasks Completed by User</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Tasks completed over time
          </span>
          <span className="@[540px]/card:hidden">Team performance</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={dynamicChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                {teamMembers.map((member) => (
                  <linearGradient
                    key={member.id}
                    id={`fill-${member.name.replace(/\s+/g, "-")}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={userColors[member.name] || "var(--primary)"}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={userColors[member.name] || "var(--primary)"}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={10}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                interval={timeRange === "7d" ? 0 : timeRange === "30d" ? 2 : 7}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {teamMembers.map((member) => (
                <Area
                  key={member.id}
                  dataKey={member.name}
                  type="monotone"
                  fill={`url(#fill-${member.name.replace(/\s+/g, "-")})`}
                  stroke={userColors[member.name] || "var(--primary)"}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
            <p>No completed tasks found in the selected time range</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
