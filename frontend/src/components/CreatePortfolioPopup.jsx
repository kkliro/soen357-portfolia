import React, { useState, useContext } from 'react';
import { createPortfolio } from '../hooks/portfolio';
import { AuthContext } from '../context/AuthContext';

export default function CreatePortfolioPopup({ closeModal, onPortfolioCreated }) {
  const { token } = useContext(AuthContext);
  const [strategy, setStrategy] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const newPortfolio = await createPortfolio(
        {
          strategy,
          name,
          description,
        },
        token
      );
      onPortfolioCreated(newPortfolio);
      closeModal();
    } catch (err) {
      console.error('Failed to create portfolio:', err);
      setError('Failed to create portfolio. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>

      {/* Popup container */}
      <div className="relative bg-gray-900 bg-opacity-90 border border-purple-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto z-10 p-6 backdrop-blur-lg">
        {/* Close button */}
        <div className="flex justify-end">
          <button onClick={closeModal} className="text-gray-400 hover:text-purple-400 transition">
            &#x2715;
          </button>
        </div>

        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-white mb-4">Create New Portfolio</h2>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="strategy" className="block text-sm font-medium text-purple-400">
              Strategy ID
            </label>
            <input
              id="strategy"
              type="number"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              required
              className="block w-full rounded-md bg-black bg-opacity-40 border border-purple-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-400">
              Portfolio Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full rounded-md bg-black bg-opacity-40 border border-purple-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-purple-400">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="block w-full rounded-md bg-black bg-opacity-40 border border-purple-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-4 py-2 text-sm font-semibold text-white transition transform hover:scale-105"
          >
            Create Portfolio
          </button>
        </form>
      </div>
    </div>
  );
}