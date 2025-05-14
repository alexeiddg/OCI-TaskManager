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
interface TeamMemberHoursData {
  sprint: string;
  [key: string]: string | number; // For dynamic team member names
}

interface TeamMemberHoursChartProps {
  data?: TeamMemberHoursData[];
  title?: string;
  teamMembers?: string[];
}

// Mock data
const defaultTeamMembers = ["John", "Sarah", "Miguel", "Aisha", "Raj"];

const defaultData: TeamMemberHoursData[] = [
  {
    sprint: "Sprint 1",
    John: 28,
    Sarah: 32,
    Miguel: 24,
    Aisha: 18,
    Raj: 22,
  },
  {
    sprint: "Sprint 2",
    John: 32,
    Sarah: 30,
    Miguel: 28,
    Aisha: 24,
    Raj: 26,
  },
  {
    sprint: "Sprint 3",
    John: 26,
    Sarah: 34,
    Miguel: 22,
    Aisha: 28,
    Raj: 24,
  },
  {
    sprint: "Sprint 4",
    John: 30,
    Sarah: 28,
    Miguel: 32,
    Aisha: 30,
    Raj: 28,
  },
  {
    sprint: "Sprint 5",
    John: 34,
    Sarah: 32,
    Miguel: 30,
    Aisha: 26,
    Raj: 30,
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

export function TeamMemberHoursChart({
  data = defaultData,
  title = "Hours Worked by Team Member",
  teamMembers = defaultTeamMembers,
}: TeamMemberHoursChartProps) {
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
                    value: "Hours Worked",
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
