import React, { useState, useEffect, useContext } from 'react';
import HeaderComponent from '../components/HeaderComponent.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { listPortfolios } from '../hooks/portfolio.js';
import PortfolioCard from '../components/PortfolioCard.jsx';
import CreatePortfolioPopup from '../components/CreatePortfolioPopup.jsx';

export default function PortfolioPage() {
  const { token } = useContext(AuthContext);
  const [portfolios, setPortfolios] = useState([]);
  const [error, setError] = useState(null);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null); // Track expanded portfolio

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
    <div className="min-h-screen bg-neutral-900 flex flex-col">
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
              isExpanded={selectedPortfolio === portfolio.id} // Pass expanded state
              onExpand={() => setSelectedPortfolio(portfolio.id)} // Expand this card
              onContract={() => setSelectedPortfolio(null)} // Contract the card
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
  );
}