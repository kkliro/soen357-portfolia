import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import HeaderComponent from '../components/HeaderComponent.jsx';
import {
  PieChart,
  Pie,
  Cell,
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

const PIE_COLORS = ['#6366F1', '#8B5CF6', '#A78BFA', '#C4B5FD', '#E9D5FF'];
const TREEMAP_COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#FF4444'];

const CustomTreemapContent = (props) => {
  const { x, y, width, height, index, name } = props;
  const fill = TREEMAP_COLORS[index % TREEMAP_COLORS.length];
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} stroke="#fff" fill={fill} />
      {width > 50 && height > 20 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      ) : null}
    </g>
  );
};

const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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

  const totalPortfolioValue =
    portfolioData &&
    portfolioData.total_gain_loss.realized + portfolioData.total_gain_loss.unrealized;
  const overallReturn = portfolioData && portfolioData.total_gain_loss.realized;
  const totalPortfolioValueClass =
    totalPortfolioValue < 0 ? 'text-red-500' : 'text-green-500';
  const overallReturnClass = overallReturn < 0 ? 'text-red-500' : 'text-green-500';

  const holdingsArr =
    portfolioData &&
    Object.entries(portfolioData.assets_by_asset).map(([symbol, shares]) => ({
      symbol,
      shares,
    }));
  const totalHoldings =
    holdingsArr && holdingsArr.reduce((sum, stock) => sum + stock.shares, 0);

  const tempData3 =
    portfolioData &&
    Object.entries(portfolioData.monthly_performance.realized).map(([date, value]) => ({ date, value }));
  const tempData =
    portfolioData &&
    Object.entries(portfolioData.investment_types).map(([name, value]) => ({ name, value }));
  const totalAssets =
    portfolioData && Object.values(portfolioData.assets_by_asset).reduce((sum, size) => sum + size, 0);
  const tempData2 =
    portfolioData &&
    Object.entries(portfolioData.assets_by_asset).map(([name, size]) => ({
      name,
      size: (size / totalAssets) * 100,
    }));

  const recentActivity =
    portfolioData &&
    portfolioData.latest_transactions.map((transaction, index) => ({
      id: index,
      description: `${transaction.symbol} (${transaction.quantity} shares) - $${transaction.total_cost.toFixed(2)}`,
      type:
        transaction.transaction_type.charAt(0).toUpperCase() +
        transaction.transaction_type.slice(1),
      date: transaction.transaction_date,
    }));

  const cardStyle =
    "bg-purple-600/10 border border-purple-600 rounded-2xl shadow-xl p-8 relative overflow-hidden";
  const miniCardStyle =
    "bg-purple-600/10 border border-purple-600 rounded-lg p-4 flex justify-between items-center mb-4 relative";

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -inset-2 bg-purple-900 opacity-20 blur-3xl rounded-3xl animate-pulse" />
      </div>
      <div className="absolute inset-0 overflow-hidden -z-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-600 opacity-10"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 0.6 + 0.4})`,
              filter: 'blur(30px)',
              animation: `float ${Math.random() * 5 + 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      <HeaderComponent />
      <main className="pt-20 px-6 md:px-20 py-10 flex-1">
        <h2 className="text-3xl font-semibold mb-6 text-white">Portfolio Summary</h2>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-center">Total Portfolio Value</h3>
            {portfolioData ? (
              <div className={`text-3xl font-bold ${totalPortfolioValueClass} text-center`}>
                ${totalPortfolioValue.toFixed(2)}
              </div>
            ) : (
              <Loader />
            )}
          </div>
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-center">Holdings</h3>
            {portfolioData ? (
              <div className="text-3xl font-bold text-white text-center">
                {totalHoldings}
              </div>
            ) : (
              <Loader />
            )}
          </div>
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-center">Overall Return</h3>
            {portfolioData ? (
              <div className={`text-3xl font-bold ${overallReturnClass} text-center`}>
                ${overallReturn.toFixed(2)}
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </div>

        <div className={`${cardStyle} mt-8`}>
          <h3 className="text-lg font-semibold mb-4 text-white text-center">
            Gains and Losses Progression Monthly
          </h3>
          {portfolioData ? (
            <div className="w-full flex justify-center">
              <AreaChart
                width={700}
                height={300}
                data={tempData3}
                margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
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
          ) : (
            <Loader />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-center">Asset Allocation</h3>
            {portfolioData ? (
              <div className="flex justify-center items-center">
                <PieChart width={300} height={300}>
                  <Pie
                    data={tempData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name }) => name}
                    labelLine={false}
                  >
                    {tempData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            ) : (
              <Loader />
            )}
          </div>

          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-center">Holding Summary</h3>
            {portfolioData ? (
              <div className="flex justify-center items-center">
                <Treemap
                  width={300}
                  height={300}
                  data={tempData2}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  content={<CustomTreemapContent />}
                />
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-white">Current Holdings</h3>
            {portfolioData ? (
              holdingsArr.map((stock, index) => (
                <div key={index} className={miniCardStyle}>
                  <span className="text-gray-300">{stock.symbol}</span>
                  <span className="text-purple-400">{stock.shares} shares</span>
                </div>
              ))
            ) : (
              <Loader />
            )}
          </div>

          <div className={cardStyle}>
            <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
            {portfolioData ? (
              recentActivity.map((activity) => {
                const tagColors = {
                  Buy: 'bg-green-500/20 text-green-400',
                  Sell: 'bg-red-500/20 text-red-400',
                  Dividend: 'bg-yellow-500/20 text-yellow-400',
                };
                const tagClass = tagColors[activity.type] || 'bg-gray-500/20 text-gray-300';
                return (
                  <div key={activity.id} className={miniCardStyle}>
                    <div>
                      <div className="text-gray-300 font-medium">{activity.description}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`${tagClass} px-2 py-1 rounded-full text-xs`}>
                      {activity.type}
                    </span>
                  </div>
                );
              })
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </main>
      <ChatbotComponent />
    </div>
  );
}