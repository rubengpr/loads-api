import { useState, useEffect } from 'react';
import { fetchAnalytics } from '../services/api';
import { AnalyticsResponse } from '../types/analytics';

interface UseAnalyticsReturn {
  data: AnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage analytics data
 */
export const useAnalytics = (): UseAnalyticsReturn => {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await fetchAnalytics();
      setData(analyticsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch analytics data';
      setError(errorMessage);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
