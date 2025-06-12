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
import { fetchSprintTotalHours } from "@/server/api/kpi/getHoursPerSprint";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


interface SprintHoursData {
  sprint: string;
  hours: number;
}

interface SprintHoursChartProps {
  data?: SprintHoursData[];
  title?: string;
  teamId?: number;
}

export function SprintHoursChart({
  data,
  title = "Total Hours per Sprint",
  teamId,
}: SprintHoursChartProps) {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<SprintHoursData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setChartData(data);
      setLoading(false);
      return;
    }

    const effectiveTeamId = teamId || Number(session?.user?.teamId);
    if (!effectiveTeamId) {
      setError("Team ID not available");
      setLoading(false);
      return;
    }

    fetchSprintTotalHours(effectiveTeamId)
      .then((sprintData) => {
        const formattedData = sprintData.map((item) => ({
          sprint: item.sprintName,
          hours: item.totalHours,
        }));
        setChartData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sprint hours data:", err);
        setError("Failed to load sprint hours data");
        setLoading(false);
      });
  }, [data, teamId, session]);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ChartContainer
            config={{
              hours: {
                label: "Hours",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
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
                    value: "Hours",
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
                <Bar
                  dataKey="hours"
                  name="Hours"
                  fill="var(--color-chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
