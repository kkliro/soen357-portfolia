import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Home, BarChart, DollarSign, User } from "lucide-react";

const portfolioData = [
  { month: "Jan", value: 69500 },
  { month: "Feb", value: 72738 },
  { month: "Mar", value: 69500 },
  { month: "Apr", value: 75975 },
  { month: "May", value: 79213 },
  { month: "Jun", value: 82450 },
];

const assetData = [
  { name: "Stocks", value: 60, color: "#7D58FF" },
  { name: "Crypto", value: 20, color: "#4ADE80" },
  { name: "Bonds", value: 15, color: "#FACC15" },
  { name: "Cash", value: 5, color: "#F87171" },
];

export default function HomePage() {
  return (
    <div className="bg-black text-white min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Portfolio Dashboard</h1>
      
      <div className="bg-[#1E1E2E] p-4 rounded-xl w-full max-w-md mb-4 text-center">
        <p className="text-gray-400">Total Portfolio Value</p>
        <h2 className="text-3xl font-bold">$82,450.75</h2>
        <p className="text-green-400">▲ $1,250.3 (1.54%)</p>
      </div>
      
      <div className="bg-[#1E1E2E] p-4 rounded-xl w-full max-w-md mb-4">
        <p className="font-bold">Portfolio Performance</p>
        <div className="bg-[#12121A] p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={portfolioData}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip wrapperClassName="text-black" />
              <Line type="monotone" dataKey="value" stroke="#7D58FF" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-[#1E1E2E] p-4 rounded-xl w-full max-w-md">
        <p className="font-bold">Asset Allocation</p>
        <div className="bg-[#12121A] p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={assetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {assetData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full bg-[#1E1E2E] flex justify-around py-3 text-gray-400">
        <Home className="text-purple-400" />
        <BarChart />
        <DollarSign />
        <User />
      </div>
    </div>
  );
}