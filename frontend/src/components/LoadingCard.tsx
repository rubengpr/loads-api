import { Card, CardContent, CardHeader } from './ui/card';

export default function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 dark:border-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading data...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
