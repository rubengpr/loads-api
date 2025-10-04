import axios from 'axios';
import { AnalyticsResponse } from '../types/analytics';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || 'apikey123';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  },
);

/**
 * Fetch analytics data from the backend
 */
export const fetchAnalytics = async (): Promise<AnalyticsResponse> => {
  const response = await apiClient.get<AnalyticsResponse>(
    '/api/inbound-calls/analytics',
  );
  return response.data;
};

export default apiClient;
