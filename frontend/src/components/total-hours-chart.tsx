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
interface SprintHoursData {
  sprint: string;
  hours: number;
}

interface SprintHoursChartProps {
  data?: SprintHoursData[];
  title?: string;
}

// Mock data
const defaultData: SprintHoursData[] = [
  { sprint: "Sprint 1", hours: 120 },
  { sprint: "Sprint 2", hours: 145 },
  { sprint: "Sprint 3", hours: 132 },
  { sprint: "Sprint 4", hours: 167 },
  { sprint: "Sprint 5", hours: 153 },
  { sprint: "Sprint 6", hours: 178 },
];

export function SprintHoursChart({
  data = defaultData,
  title = "Total Hours per Sprint",
}: SprintHoursChartProps) {
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
