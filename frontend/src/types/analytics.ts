// Type definitions for analytics API response

export type AnalyticsSummary = {
  total_calls: number;
  period: string;
  last_updated: string;
};

export type MonthlyData = {
  month: string;
  year: number;
  calls: number;
};

export type SentimentData = {
  sentiment: 'positive' | 'neutral' | 'negative';
  count: number;
  percentage: number;
};

export type OutcomeData = {
  outcome: 'transferred' | 'canceled';
  count: number;
  percentage: number;
};

export type CarrierData = {
  carrier_name: string;
  calls: number;
};

export type AnalyticsResponse = {
  summary: AnalyticsSummary;
  by_month: MonthlyData[];
  by_sentiment: SentimentData[];
  by_outcome: OutcomeData[];
  by_carrier: CarrierData[];
};
