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
import { MonthlyData } from '../../types/analytics';

export const description = 'A bar chart';

const CHART_CONFIG = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface VerticalBarChartProps {
  data: MonthlyData[];
}

function VerticalBarChart({ data }: VerticalBarChartProps) {
  const totalCalls = data.reduce((sum, item) => sum + item.calls, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbound calls by month</CardTitle>
        <CardDescription>
          {totalCalls.toLocaleString()} total calls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG}>
          <div style={{ width: '100%', height: 303 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart accessibilityLayer data={[...data].reverse()}>
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
