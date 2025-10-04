import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          Error Loading Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
