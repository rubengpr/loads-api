import { Truck } from 'lucide-react';
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
  CardHeader,
  CardTitle,
} from '../ui/card';
import type { ChartConfig } from '../ui/chart';
import { ChartContainer } from '../ui/chart';

type CarrierDatum = {
  carrier: string;
  calls: number;
};

const CARRIER_DATA: CarrierDatum[] = [
  { carrier: 'Swift Transportation', calls: 156 },
  { carrier: 'J.B. Hunt Transport', calls: 142 },
  { carrier: 'Schneider National', calls: 128 },
  { carrier: 'Knight-Swift', calls: 115 },
  { carrier: 'Werner Enterprises', calls: 98 },
  { carrier: 'Prime Inc.', calls: 87 },
  { carrier: 'Covenant Transport', calls: 73 },
  { carrier: 'U.S. Xpress', calls: 65 },
  { carrier: 'Heartland Express', calls: 54 },
  { carrier: 'Marten Transport', calls: 42 },
];

const CHART_CONFIG = {
  calls: {
    label: 'Calls',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const CarrierTooltip = ({
  payload,
  active,
}: {
  payload?: any[];
  active?: boolean;
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const selectedCarrierData = payload[0].payload;
  const total = CARRIER_DATA.reduce(
    (sum: number, item: CarrierDatum) => sum + item.calls,
    0,
  );
  const percentage = Math.round((selectedCarrierData.calls / total) * 100);

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 text-sm shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-1">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {selectedCarrierData.carrier}
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">Total Calls:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {selectedCarrierData.calls.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">
            Market Share:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

function HorizontalBarChart() {
  const total = CARRIER_DATA.reduce((sum, item) => sum + item.calls, 0);
  const topCarrier = CARRIER_DATA[0];
  const topCarrierPercentage = Math.round((topCarrier.calls / total) * 100);

  // Debug logging
  console.log('CarrierUsageChart - Data:', CARRIER_DATA);
  console.log('CarrierUsageChart - Total:', total);
  console.log('CarrierUsageChart - Sample item:', CARRIER_DATA[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Top Carrier Usage
        </CardTitle>
        <CardDescription>
          Total inbound calls grouped by carrier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG}>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CARRIER_DATA}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
              >
                <CartesianGrid
                  horizontal={true}
                  stroke="rgb(var(--muted-foreground))"
                  strokeOpacity={0.1}
                />
                <XAxis
                  type="number"
                  domain={[
                    0,
                    (dataMax) => Math.ceil((dataMax * 1.1) / 10) * 10,
                  ]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                />
                <YAxis
                  type="category"
                  dataKey="carrier"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={110}
                  interval={0}
                  tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }}
                />
                <Tooltip cursor={false} content={<CarrierTooltip />} />
                <Bar
                  dataKey="calls"
                  fill="var(--color-calls)"
                  radius={[0, 4, 4, 0]}
                  onMouseEnter={(data, index) => {
                    console.log('Bar hovered:', data, index);
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Top 3 Carriers Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
          {CARRIER_DATA.slice(0, 3).map((carrier, index) => {
            const percentage = Math.round((carrier.calls / total) * 100);
            const position = index + 1;

            return (
              <div
                key={carrier.carrier}
                className="flex items-center gap-2 text-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-base font-medium">
                  {position}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {carrier.carrier}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {carrier.calls.toLocaleString()} calls ({percentage}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default HorizontalBarChart;
