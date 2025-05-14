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

// Define the data structure
interface CompletedTasksData {
  sprint: string;
  [key: string]: string | number; // For dynamic team member names
}

interface CompletedTasksChartProps {
  data?: CompletedTasksData[];
  title?: string;
  teamMembers?: string[];
}

// Mock data
const defaultTeamMembers = ["John", "Sarah", "Miguel", "Aisha", "Raj"];

const defaultData: CompletedTasksData[] = [
  {
    sprint: "Sprint 1",
    John: 5,
    Sarah: 7,
    Miguel: 4,
    Aisha: 6,
    Raj: 3,
  },
  {
    sprint: "Sprint 2",
    John: 6,
    Sarah: 8,
    Miguel: 5,
    Aisha: 7,
    Raj: 4,
  },
  {
    sprint: "Sprint 3",
    John: 8,
    Sarah: 6,
    Miguel: 7,
    Aisha: 5,
    Raj: 6,
  },
  {
    sprint: "Sprint 4",
    John: 7,
    Sarah: 9,
    Miguel: 6,
    Aisha: 8,
    Raj: 5,
  },
  {
    sprint: "Sprint 5",
    John: 9,
    Sarah: 7,
    Miguel: 8,
    Aisha: 6,
    Raj: 7,
  },
];

// Chart colors from theme
const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function CompletedTasksChart({
  data = defaultData,
  title = "Completed Tasks by Team Member",
  teamMembers = defaultTeamMembers,
}: CompletedTasksChartProps) {
  // Create config for ChartContainer
  const chartConfig = teamMembers.reduce(
    (config, member, index) => {
      config[member] = {
        label: member,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
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
                data={data}
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
                {teamMembers.map((member, index) => (
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
