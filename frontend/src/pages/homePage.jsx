import HeaderComponent from '../components/headerComponent.jsx';
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
import upArrow from '../assets/upArrow.png';

const tempData = [
  { name: 'Stocks', value: 400 },
  { name: 'Crypto', value: 300 },
  { name: 'Treasuries', value: 300 },
  { name: 'Currencies', value: 200 },
];

const tempData2 = [
  {
    name: 'Stocks',
    children: [
      { name: 'AAPL', size: 24593 },
      { name: 'SPY', size: 1302 },
      { name: 'VOO', size: 652 },
      { name: 'NVDA', size: 636 },
      { name: 'GOOGL', size: 6703 },
    ],
  },
];

const tempData3 = [
  { date: 'Jan', value: 1000 },
  { date: 'Feb', value: 1200 },
  { date: 'Mar', value: 900 },
  { date: 'Apr', value: 1400 },
  { date: 'May', value: 1800 },
  { date: 'Jun', value: 2000 },
];

const recentActivity = [
  { id: 1, description: 'AAPL (5 shares)', type: 'Buy' },
  { id: 2, description: 'TSLA (3 shares)', type: 'Sell' },
  { id: 3, description: 'VOO', type: 'Dividend' },
];

const holdings = [
  { symbol: 'AAPL', shares: 25 },
  { symbol: 'SPY', shares: 10 },
  { symbol: 'NVDA', shares: 15 },
  { symbol: 'GOOGL', shares: 20 },
];


export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <HeaderComponent />
      <main className="px-6 md:px-20 py-10 flex-1">
        <h2 className="text-3xl font-semibold mb-6 text-white">
          Portfolio Summary
        </h2>

        <div className="bg-indigo-900/20 shadow-lg rounded-xl p-6 flex flex-col items-center">

          {/* Portfolio Value */}
          <h3 className="text-sm text-white mb-1">Total Portfolio Value</h3>
          <div className="text-4xl font-bold text-white">$30,928.38</div>
          <div className="flex items-center text-teal-400 mt-2 text-sm mb-4">
            <img src={upArrow} alt="Up Arrow" className="w-4 h-4 mr-1" />
            <span>$1,250.3 (1.54%)</span>
          </div>

          {/* Area Chart */}
          <AreaChart
            width={730}
            height={250}
            data={tempData3}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366F1"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

          {/* Pie Chart */}
          <div className="bg-indigo-900/20 shadow-lg rounded-xl p-6 text-white">
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
                  label
                />
              </PieChart>
            </div>
          </div>

          {/* Treemap */}
          <div className="bg-indigo-900/20 shadow-lg rounded-xl p-6 text-white">
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
          
          {/* Holdings */}
          <div className="bg-indigo-900/20 shadow-lg rounded-xl p-6 text-white">
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

          {/* Recent Activity */}
          <div className="bg-indigo-900/20 shadow-lg rounded-xl p-6 text-white">
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
    </div>
  );
}