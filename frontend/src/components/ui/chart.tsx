import * as React from 'react';

export type ChartConfig = Record<string, { label: string; color: string }>;

type ChartContainerProps = {
  config: ChartConfig;
  children: React.ReactNode;
  className?: string;
};

export function ChartContainer({
  config,
  children,
  className = '',
}: ChartContainerProps) {
  React.useEffect(() => {
    Object.entries(config).forEach(([key, value]) => {
      const cssVarName = `--color-${key}`;
      document.documentElement.style.setProperty(cssVarName, value.color);
    });
  }, [config]);

  return (
    <div className={'w-full overflow-hidden ' + className}>{children}</div>
  );
}

type ChartTooltipProps = {
  content: React.ReactNode;
  cursor?: boolean;
};

export function ChartTooltip({ content }: ChartTooltipProps) {
  return <>{content}</>;
}

type ChartTooltipContentProps = {
  hideLabel?: boolean;
  label?: string;
  payload?: Array<{ dataKey: string; value: number; color?: string }>;
};

export function ChartTooltipContent({
  hideLabel,
  label,
  payload,
}: ChartTooltipContentProps) {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white p-2 text-sm shadow-md dark:border-gray-800 dark:bg-gray-900">
      {!hideLabel && label ? (
        <div className="mb-1 font-medium text-gray-800 dark:text-gray-100">
          {label}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: item.color ?? 'var(--gray-700)' }}
            />
            <span className="ml-auto font-medium text-gray-900 dark:text-gray-100">
              {item.value} calls
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
