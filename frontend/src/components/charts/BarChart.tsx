import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import type { ChartConfig } from '../ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import KpiChip from '../ui/KpiChip';

export const description = 'A bar chart';

const chartData = [
  { month: 'January', calls: 186 },
  { month: 'February', calls: 305 },
  { month: 'March', calls: 237 },
  { month: 'April', calls: 73 },
  { month: 'May', calls: 209 },
  { month: 'June', calls: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

function VerticalBarChart() {
  const totalDesktop = chartData.reduce((sum, item) => sum + item.calls, 0);

  // Calculate real data insights
  const currentMonth = chartData[chartData.length - 1]; // June
  const previousMonth = chartData[chartData.length - 2]; // May
  const highestMonth = chartData.reduce((max, item) =>
    item.calls > max.calls ? item : max,
  );
  const lowestMonth = chartData.reduce((min, item) =>
    item.calls < min.calls ? item : min,
  );

  const monthOverMonthChange =
    ((currentMonth.calls - previousMonth.calls) / previousMonth.calls) * 100;
  const isIncreasing = monthOverMonthChange > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Inbound calls managed by month</CardTitle>
          <KpiChip isOnTarget={isIncreasing}>
            {isIncreasing ? 'On Target' : 'Needs Review'}
          </KpiChip>
        </div>
        <CardDescription>
          {totalDesktop.toLocaleString()} total calls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <div style={{ width: '100%', height: 303 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgb(var(--muted-foreground))"
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => value.toLocaleString()}
                  tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="calls" fill="var(--color-desktop)" radius={5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default VerticalBarChart;
