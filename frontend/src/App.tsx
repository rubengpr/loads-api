import VerticalBarChart from './components/charts/BarChart';
import SentimentPieChart from './components/charts/PieChart';
import HorizontalBarChart from './components/charts/HorizontalBarChart';
import DonutChart from './components/charts/DonutChart';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <div className="max-w-7xl w-full">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-6">
          <div className="lg:col-span-2">
            <VerticalBarChart />
          </div>
          <div className="lg:col-span-2">
            <DonutChart />
          </div>
          <div className="lg:col-span-2">
            <SentimentPieChart />
          </div>
          <div className="lg:col-span-6">
            <HorizontalBarChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
