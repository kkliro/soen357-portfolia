import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import HeaderComponent from '../components/HeaderComponent.jsx';
import {
  PieChart,
  Pie,
  Treemap,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { portfolioPerformance } from '../hooks/portfolio.js';
import ChatbotComponent from '../components/chatbotComponent.jsx';

export default function HomePage() {
  const { token } = useContext(AuthContext);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!token) {
        console.error('No token available');
        setLoading(false);
        return;
      }

      try {
        const data = await portfolioPerformance(token);
        setPortfolioData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [token]);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  const tempData3 = Object.entries(portfolioData.monthly_performance.realized).map(
    ([date, value]) => ({
      date,
      value,
    })
  );

  const tempData = Object.entries(portfolioData.investment_types).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const totalAssets = Object.values(portfolioData.assets_by_asset).reduce(
    (sum, size) => sum + size,
    0
  );
  
  const tempData2 = Object.entries(portfolioData.assets_by_asset).map(
    ([name, size]) => ({
      name,
      size: (size / totalAssets) * 100,
    })
  );

  const recentActivity = portfolioData.latest_transactions.map((transaction, index) => ({
    id: index,
    description: `${transaction.symbol} (${transaction.quantity} shares) - $${transaction.total_cost.toFixed(2)}`,
    type: transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1),
  }));

  const holdings = Object.entries(portfolioData.assets_by_asset).map(
    ([symbol, shares]) => ({
      symbol,
      shares,
    })
  );

  const portfolioValueClassRealized =
    portfolioData.total_gain_loss.realized < 0 ? 'text-red-500' : 'text-green-500';

  const portfolioValueClassUnrealized =
    portfolioData.total_gain_loss.unrealized < 0 ? 'text-red-500' : 'text-green-500';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <HeaderComponent />
      <main className="pt-20 px-6 md:px-20 py-10 flex-1">
        <h2 className="text-3xl font-semibold mb-6 text-white">
          Portfolio Summary
        </h2>

        {/* Portfolio Value Section */}
        <div className="bg-gray-900 bg-opacity-70 shadow-lg rounded-2xl p-8 flex flex-col items-center border border-purple-800">
          <h3 className="text-sm text-white mb-4">Total Portfolio Value</h3>
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Realized</span>
              <div
                className={`text-4xl font-bold ${portfolioValueClassRealized} bg-gray-800 px-6 py-3 rounded-lg shadow-md`}
              >
                ${portfolioData.total_gain_loss.realized.toFixed(2)}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Unrealized</span>
              <div
                className={`text-4xl font-bold ${portfolioValueClassUnrealized} bg-gray-800 px-6 py-3 rounded-lg shadow-md`}
              >
                ${portfolioData.total_gain_loss.unrealized.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Gains and Losses Progression Monthly */}
        <div className="bg-gray-900 bg-opacity-70 shadow-lg rounded-2xl p-8 mt-8 border border-purple-800">
          <h3 className="text-lg font-semibold mb-4 text-white text-center">
            Gains and Losses Progression Monthly
          </h3>
          <div className="w-full flex justify-center">
            <AreaChart
              width={700} // Adjusted width to fit better within the card
              height={300}
              data={tempData3}
              margin={{ top: 10, right: 30, left: 30, bottom: 0 }} // Added left margin for centering
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Pie Chart Card */}
          <div className="bg-gray-900 bg-opacity-70 shadow-lg rounded-2xl p-8 text-white border border-purple-800">
            <h3 className="text-lg font-semibold mb-4 text-center">Asset Allocation</h3>
            <div className="flex justify-center items-center">
            <PieChart width={300} height={300}>
              <Pie
                data={tempData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#6366F1"
                label={({ name }) => name}
                labelLine={false}
              />
            </PieChart>
            </div>
          </div>

          {/* Treemap Card */}
          <div className="bg-gray-900 bg-opacity-70 shadow-lg rounded-2xl p-8 text-white border border-purple-800">
            <h3 className="text-lg font-semibold mb-4 text-center">Holding Summary</h3>
            <div className="flex justify-center items-center">
              <Treemap
                width={300}
                height={300}
                data={tempData2}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#6366F1"
              />
            </div>
          </div>

          {/* Holdings Card */}
          <div className="bg-gray-900 bg-opacity-70 shadow-lg rounded-2xl p-8 text-white border border-purple-800">
            <h3 className="text-lg font-semibold mb-4">Current Holdings</h3>
            <ul className="space-y-2">
              {holdings.map((stock, index) => (
                <li key={index} className="flex justify-between">
                  <span>{stock.symbol}</span>
                  <span>{stock.shares} shares</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-gray-900 bg-opacity-70 shadow-lg rounded-2xl p-8 text-white border border-purple-800">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              {recentActivity.map((activity) => {
                const tagColors = {
                  Buy: 'bg-green-500/20 text-green-400',
                  Sell: 'bg-red-500/20 text-red-400',
                  Dividend: 'bg-yellow-500/20 text-yellow-400',
                };
                const tagClass = tagColors[activity.type] || 'bg-gray-500/20 text-gray-300';

                return (
                  <li key={activity.id} className="flex justify-between items-center">
                    <span>{activity.description}</span>
                    <span className={`${tagClass} px-2 py-1 rounded-full text-xs`}>{activity.type}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
      <ChatbotComponent />
    </div>
  );
}