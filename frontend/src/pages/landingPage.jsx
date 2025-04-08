import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [chartData, setChartData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const generateData = () => {
      const data = [];
      let value = 1000;
      
      for (let i = 0; i < 12; i++) {
        value = value * (1 + (Math.random() * 0.08 - 0.02));
        data.push({
          month: `Month ${i + 1}`,
          value: Math.round(value),
          growth: Math.round(value * 0.85),
          diversification: Math.round(Math.random() * 100)
        });
      }
      return data;
    };

    setChartData(generateData());
    setTimeout(() => setIsAnimating(true), 500);
  }, []);

  const features = [
    {
      title: "Track Investments",
      description: "Monitor all your investments in one place with real-time updates and notifications."
    },
    {
      title: "Multiple Portfolios",
      description: "Create and manage multiple portfolios for different investment goals and strategies."
    },
    {
      title: "Smart Strategies",
      description: "Build custom investment strategies or use our AI-powered recommendations."
    },
    {
      title: "Asset Diversification",
      description: "Visualize and optimize your asset allocation across different sectors and markets."
    },
    {
      title: "AI Analytics",
      description: "Leverage advanced AI to gain insights and predict market trends for smarter decisions."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-600 opacity-10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 0.6 + 0.4})`,
              filter: 'blur(40px)',
              animation: `float ${Math.random() * 20 + 20}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />

      <div className="relative z-20 w-full">
        <nav className="fixed top-0 w-full bg-black bg-opacity-70 backdrop-blur-lg z-50 px-6 py-4 flex justify-between items-center border-b border-purple-900">
          <div className="text-2xl font-bold text-purple-400">Portfolia</div>
          <div className="flex gap-4 mt-4">
            <Link to="/login">
              <button className="px-4 py-2 bg-indigo-600 rounded-lg">Login</button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-purple-600 rounded-lg">Sign Up</button>
            </Link>
          </div>
        </nav>

        <div className="min-h-screen flex items-center px-6 py-24">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
                Portfolia
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-lg">
                Smart investment tracking and portfolio management powered by cutting-edge AI analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg font-bold transition transform hover:scale-105">
                  Get Started Free
                </button>
                <button className="px-8 py-4 bg-black bg-opacity-50 border border-purple-500 text-purple-400 hover:text-white hover:border-purple-400 rounded-lg font-bold transition transform hover:scale-105">
                  See Demo
                </button>
              </div>
            </div>
            
            <div className={`relative transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              <div className="absolute -inset-2 bg-purple-900 opacity-20 blur-xl rounded-3xl animate-pulse"/>
              <div className="relative bg-gray-900 bg-opacity-70 p-6 rounded-2xl border border-purple-800">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }} />
                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-700 rounded-full opacity-30 blur-3xl animate-ping" style={{animationDuration: '8s'}}/>
            </div>
          </div>
        </div>

        <div className="w-full px-6 py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-black opacity-20" />
          <div className="max-w-7xl mx-auto relative">
            <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-16">
              Powerful Features for Smart Investing
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl backdrop-blur-sm bg-gray-900 bg-opacity-40 border border-purple-900 hover:border-purple-500 transition-all transform hover:scale-105 ${
                    isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms`, transitionDuration: '700ms' }}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-600 bg-opacity-30 flex items-center justify-center mb-4">
                    <div className="w-6 h-6 rounded-full bg-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-300 mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full px-6 py-24 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-16">
              AI-Powered Analytics
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className={`transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-purple-700 opacity-20 blur-xl rounded-3xl" />
                  <div className="relative p-6 rounded-xl bg-gray-900 bg-opacity-70 border border-purple-800">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">Performance Tracking</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData}>
                        <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                        <YAxis tick={{ fill: '#9CA3AF' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }} />
                        <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
                        <Line type="monotone" dataKey="growth" stroke="#EC4899" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className={`transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '200ms' }}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-purple-700 opacity-20 blur-xl rounded-3xl" />
                  <div className="relative p-6 rounded-xl bg-gray-900 bg-opacity-70 border border-purple-800">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">Asset Diversification</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                        <YAxis tick={{ fill: '#9CA3AF' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }} />
                        <Bar dataKey="diversification" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-6 py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-black opacity-30" />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="absolute -inset-8 bg-purple-600 opacity-10 blur-3xl rounded-full animate-pulse" style={{animationDuration: '6s'}}/>
            <div className="relative bg-black bg-opacity-40 backdrop-blur-lg p-12 rounded-2xl border border-purple-800">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to optimize your investments?
              </h2>
              <p className="text-lg text-purple-200 mb-8 max-w-lg mx-auto">
                Join thousands of investors who are making smarter decisions with Portfolia's AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg transition transform hover:scale-105">
                  Get Started Now
                </button>
                <button className="px-10 py-4 bg-black bg-opacity-40 hover:bg-opacity-60 text-white border border-purple-400 rounded-lg font-bold text-lg transition transform hover:scale-105">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full px-6 py-8 bg-black bg-opacity-80 backdrop-blur-md border-t border-purple-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-2xl font-bold text-purple-400">Portfolia</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">About</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">Features</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">Pricing</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">Contact</a>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Portfolia. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;