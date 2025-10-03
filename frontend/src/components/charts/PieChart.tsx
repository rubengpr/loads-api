import { Smile, Meh, Frown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import KpiChip from '../ui/KpiChip';

type SentimentDatum = {
  sentiment: 'positive' | 'neutral' | 'negative';
  count: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
};

const data: SentimentDatum[] = [
  {
    sentiment: 'positive',
    count: 89,
    percentage: 44.5,
    color: '#9df8be',
    icon: <Smile className="h-6 w-6" />,
  },
  {
    sentiment: 'neutral',
    count: 67,
    percentage: 33.5,
    color: '#e5e5e5',
    icon: <Meh className="h-6 w-6" />,
  },
  {
    sentiment: 'negative',
    count: 44,
    percentage: 22.0,
    color: '#f79a9a',
    icon: <Frown className="h-6 w-6" />,
  },
];

const COLORS = ['#9df8be', '#e5e5e5', '#f79a9a'];

const SentimentTooltip = ({ payload }: { payload?: Array<any> }) => {
  if (!payload || payload.length === 0) return null;
  const entry = payload[0];
  const groupName: string = entry?.payload?.sentiment ?? '';
  const groupValue: number = entry?.value ?? 0;
  const color: string | undefined = entry?.payload?.color;
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const pct = Math.round((groupValue / total) * 100);

  return (
    <div className="rounded-md border border-gray-200 bg-white p-2 text-sm shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-700 dark:text-gray-300 capitalize">
          {groupName}
        </span>
        <span className="ml-auto font-medium text-gray-900 dark:text-gray-100">
          {pct}% • {groupValue} calls
        </span>
      </div>
    </div>
  );
};

function SentimentPieChart() {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const positiveCount =
    data.find((d) => d.sentiment === 'positive')?.count ?? 0;
  const positivePercentage = Math.round((positiveCount / total) * 100);

  // KPI logic: Positive sentiment target is 40% or higher
  const isOnTarget = positivePercentage >= 60;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Carrier Sentiment Analysis</CardTitle>
          <KpiChip isOnTarget={isOnTarget}>
            {isOnTarget ? 'On Target' : 'Needs Review'}
          </KpiChip>
        </div>
        <CardDescription>Inferred caller sentiment during call</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="sentiment"
                innerRadius={49}
                outerRadius={70}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.sentiment}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip cursor={false} content={<SentimentTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center mt-6 gap-2">
          {data.map((item) => (
            <div
              key={item.sentiment}
              className="group flex items-center justify-between p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    {item.percentage}%
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {item.count} calls
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

export default SentimentPieChart;
