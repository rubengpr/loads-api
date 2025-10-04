import { CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import KpiChip from '../ui/kpi-chip';
import { OutcomeData } from '../../types/analytics';

type OutcomeDatum = {
  name: 'transferred' | 'canceled';
  value: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
};

// Minimal palette: accent for transferred, muted gray for canceled
const OUTCOME_COLORS = ['var(--chart-2)', 'var(--chart-4)'];

interface DonutChartProps {
  data: OutcomeData[];
}

export default function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const transferred = data.find((d) => d.outcome === 'transferred')?.count ?? 0;
  const transferredPercentage = Math.round((transferred / total) * 100);

  // Format data for the chart
  const chartData: OutcomeDatum[] = data.map((item) => ({
    name: item.outcome,
    value: item.count,
    percentage: item.percentage,
    color: item.outcome === 'transferred' ? 'var(--chart-2)' : 'var(--chart-4)',
    icon:
      item.outcome === 'transferred' ? (
        <CheckCircle className="h-6 w-6" />
      ) : (
        <XCircle className="h-6 w-6" />
      ),
  }));

  // KPI logic: Transfer rate target is 70% or higher
  const isOnTarget = transferredPercentage >= 70;

  const CustomTooltip = ({ payload }: { payload?: Array<any> }) => {
    if (!payload || payload.length === 0) return null;
    const entry = payload[0];
    const groupName: string = entry?.payload?.name ?? '';
    const groupValue: number = entry?.value ?? 0;
    const color: string | undefined = entry?.payload?.fill;
    const pct = entry?.payload?.percentage ?? 0;

    return (
      <div className="rounded-md border border-gray-200 bg-white p-2 text-sm shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-gray-700 dark:text-gray-300">
            {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
          </span>
          <span className="ml-auto font-medium text-gray-900 dark:text-gray-100">
            {pct}% • {groupValue} calls
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Call outcomes</CardTitle>
          <KpiChip isOnTarget={isOnTarget}>
            {isOnTarget ? 'On Target' : 'Needs Review'}
          </KpiChip>
        </div>
        <CardDescription>Result of calls managed by agent</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={49}
                outerRadius={70}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={OUTCOME_COLORS[index % OUTCOME_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip cursor={false} content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center mt-6 gap-2">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="group flex items-center justify-center flex-1 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {item.percentage}% {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {item.value} calls
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
