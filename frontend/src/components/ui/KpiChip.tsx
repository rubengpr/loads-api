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
      className={`px-2 py-[2px] rounded-full text-xs font-medium ${
        isOnTarget ? chipStyles.onTarget : chipStyles.needsReview
      }`}
    >
      {children}
    </div>
  );
}
