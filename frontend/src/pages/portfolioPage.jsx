import React, { useState, useEffect, useContext } from 'react';
import HeaderComponent from '../components/headerComponent.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { listPortfolios } from '../hooks/portfolio.js';
import PortfolioCard from '../components/portfolioCard.jsx';

export default function PortfolioPage() {
  const { token } = useContext(AuthContext);
  const [portfolios, setPortfolios] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <HeaderComponent />
      <main className="px-6 md:px-20 py-10 flex-1">
        <h2 className="text-3xl font-semibold mb-6 text-white">Portfolio Overview</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {portfolios.map((portfolio) => (
            <PortfolioCard 
              key={portfolio.id} 
              portfolio={portfolio} 
              onPortfolioUpdated={fetchPortfolios} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}