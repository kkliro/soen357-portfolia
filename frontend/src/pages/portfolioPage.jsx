import React, { useState, useEffect, useContext } from 'react';
import HeaderComponent from '../components/HeaderComponent.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { listPortfolios } from '../hooks/portfolio.js';
import PortfolioCard from '../components/PortfolioCard.jsx';
import CreatePortfolioPopup from '../components/CreatePortfolioPopup.jsx';
import ChatbotComponent from '../components/chatbotComponent.jsx';

export default function PortfolioPage() {
  const { token } = useContext(AuthContext);
  const [portfolios, setPortfolios] = useState([]);
  const [error, setError] = useState(null);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const fetchPortfolios = async () => {
    try {
      const data = await listPortfolios(token);
      setPortfolios(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortfolios();
    }
  }, [token]);

  const handlePortfolioCreated = (newPortfolio) => {
    setPortfolios((prevPortfolios) => [...prevPortfolios, newPortfolio]);
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      {/* Background Glowy Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-600 opacity-10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 500 - 50}%`,
              top: `${Math.random() * 520 - 50}%`,
              transform: `scale(${Math.random() * 0.6 + 0.4})`,
              filter: 'blur(40px)',
              animation: `float ${Math.random() * 20 + 20}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />

      <div className="relative z-20 flex flex-col flex-1">
        <HeaderComponent />
        <main className="pt-20 px-6 md:px-20 py-10 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-white">Portfolio Overview</h2>
            <button
              onClick={() => setIsCreatePopupOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              Create Portfolio
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                isExpanded={selectedPortfolio === portfolio.id} 
                onExpand={() => setSelectedPortfolio(portfolio.id)}
                onContract={() => setSelectedPortfolio(null)}
                onPortfolioUpdated={fetchPortfolios}
              />
            ))}
          </div>
        </main>
        {isCreatePopupOpen && (
          <CreatePortfolioPopup
            closeModal={() => setIsCreatePopupOpen(false)}
            onPortfolioCreated={handlePortfolioCreated}
          />
        )}
      </div>
      <div className="relative z-30">
          <ChatbotComponent />
      </div>
    </div>
  );
}