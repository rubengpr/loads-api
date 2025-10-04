import { ReactNode } from 'react';

interface KpiChipProps {
  isOnTarget: boolean;
  children: ReactNode;
}

const chipStyles = {
  onTarget: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  needsReview:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default function KpiChip({ isOnTarget, children }: KpiChipProps) {
  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isOnTarget ? chipStyles.onTarget : chipStyles.needsReview
      }`}
    >
      {children}
    </div>
  );
}
