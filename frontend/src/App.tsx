import VerticalBarChart from './components/charts/BarChart';
import SentimentPieChart from './components/charts/PieChart';
import HorizontalBarChart from './components/charts/HorizontalBarChart';
import DonutChart from './components/charts/DonutChart';
import Header from './components/Header';
import LoadingCard from './components/LoadingCard';
import ErrorCard from './components/ErrorCard';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const { data, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="max-w-7xl w-full">
          <Header lastUpdated={null} />
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-6">
            <div className="lg:col-span-2">
              <LoadingCard />
            </div>
            <div className="lg:col-span-2">
              <LoadingCard />
            </div>
            <div className="lg:col-span-2">
              <LoadingCard />
            </div>
            <div className="lg:col-span-6">
              <LoadingCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="max-w-7xl w-full">
          <Header lastUpdated={null} />
          <div className="mt-6">
            <ErrorCard
              message={error || 'Failed to load data'}
              onRetry={refetch}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <div className="max-w-7xl w-full">
        <Header lastUpdated={data.summary.last_updated} />
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-6">
          <div className="lg:col-span-2">
            <VerticalBarChart data={data.by_month} />
          </div>
          <div className="lg:col-span-2">
            <DonutChart data={data.by_outcome} />
          </div>
          <div className="lg:col-span-2">
            <SentimentPieChart data={data.by_sentiment} />
          </div>
          <div className="lg:col-span-6">
            <HorizontalBarChart data={data.by_carrier} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
