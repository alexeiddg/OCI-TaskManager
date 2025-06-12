"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { fetchCompletedTasksByMemberPerSprint } from "@/server/api/kpi/getCompletedTasksByMemberPerSprint";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CompletedTasksData {
  sprint: string;
  [key: string]: string | number; // For dynamic team member names
}

interface CompletedTasksChartProps {
  data?: CompletedTasksData[];
  title?: string;
  teamMembers?: string[];
  teamId?: number;
}

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
  "var(--color-chart-7)",
  "var(--color-chart-8)",
  "var(--color-chart-9)",
  "var(--color-chart-10)",
];

export function CompletedTasksChart({
  data,
  title = "Completed Tasks by Team Member",
  teamMembers,
  teamId,
}: CompletedTasksChartProps) {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<CompletedTasksData[]>([]);
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && teamMembers) {
      setChartData(data);
      setMemberNames(teamMembers);
      setLoading(false);
      return;
    }

    const effectiveTeamId = teamId || Number(session?.user?.teamId);
    if (!effectiveTeamId) {
      setError("Team ID not available");
      setLoading(false);
      return;
    }

    fetchCompletedTasksByMemberPerSprint(effectiveTeamId)
      .then((sprintData) => {
        const processedData: CompletedTasksData[] = [];
        const members = new Set<string>();

        // collect all unique member names
        sprintData.forEach((sprint) => {
          sprint.tasksByMember.forEach((member) => {
            members.add(member.memberName);
          });
        });

        const memberList = Array.from(members);
        setMemberNames(memberList);

        // create the data structure for each sprint
        sprintData.forEach((sprint) => {
          const sprintEntry: CompletedTasksData = {
            sprint: sprint.sprintName,
          };

          // Initialize all members with 0 tasks
          memberList.forEach((member) => {
            sprintEntry[member] = 0;
          });

          // Update with actual completed tasks
          sprint.tasksByMember.forEach((member) => {
            sprintEntry[member.memberName] = member.completedTasks;
          });

          processedData.push(sprintEntry);
        });

        setChartData(processedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch completed tasks by member data:", err);
        setError("Failed to load completed tasks by member data");
        setLoading(false);
      });
  }, [data, teamMembers, teamId, session]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }
  // Sort sprint data by sprint number
  const sortedChartData = [...chartData].sort((a, b) => {
    // Extract sprint numbers using regex
    const aMatch = a.sprint.match(/Sprint\s+(\d+)/i);
    const bMatch = b.sprint.match(/Sprint\s+(\d+)/i);

    const aNum = aMatch ? parseInt(aMatch[1], 10) : 0;
    const bNum = bMatch ? parseInt(bMatch[1], 10) : 0;

    return aNum - bNum;
  });

  // Create config for ChartContainer
  const chartConfig = memberNames.reduce(
    (config, member, index) => {
      config[member] = {
        label: member,
        color: `hsl(var(--chart-${(index % 10) + 1}))`,
      };
      return config;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="sprint"
                  tick={{ fill: "var(--color-foreground)" }}
                  tickLine={{ stroke: "var(--color-foreground)" }}
                  axisLine={{ stroke: "var(--color-foreground)" }}
                />
                <YAxis
                  label={{
                    value: "Completed Tasks",
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--color-foreground)",
                  }}
                  tick={{ fill: "var(--color-foreground)" }}
                  tickLine={{ stroke: "var(--color-foreground)" }}
                  axisLine={{ stroke: "var(--color-foreground)" }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                {memberNames.map((member, index) => (
                  <Bar
                    key={member}
                    dataKey={member}
                    name={member}
                    fill={chartColors[index % chartColors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
