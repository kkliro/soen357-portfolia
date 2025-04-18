import React, { useState, useContext } from 'react';
import { updatePortfolio, deletePortfolio } from '../hooks/portfolio.js';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';
import { FaFolder, FaChartLine, FaDollarSign } from 'react-icons/fa';
import RecommendationsPanel from './RecommendationsPanel';

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'CAD', 'GBP'];

export default function PortfolioCard({
  portfolio,
  isExpanded,
  onExpand,
  onContract,
  onPortfolioUpdated,
}) {
  const { token } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePortfolio, setEditablePortfolio] = useState({
    name: portfolio.name,
    description: portfolio.description,
    strategy: portfolio.strategy,
    currency: portfolio.currency,
  });
  const [notification, setNotification] = useState({ message: '', success: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditablePortfolio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updatePortfolio(portfolio.id, token, editablePortfolio);
      setNotification({ message: 'Update succeeded', success: true });
      setIsEditing(false);
      if (onPortfolioUpdated) {
        onPortfolioUpdated();
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Update failed', success: false });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePortfolio(portfolio.id, token);
      setNotification({ message: 'Deletion succeeded', success: true });
      if (onPortfolioUpdated) {
        onPortfolioUpdated();
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Deletion failed', success: false });
    }
  };

  const handleCancel = () => {
    setEditablePortfolio({
      name: portfolio.name,
      description: portfolio.description,
      strategy: portfolio.strategy,
      currency: portfolio.currency,
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-purple-600/10 shadow-lg rounded-xl p-6 text-white ring-2 ring-purple-600 flex flex-col transition-all duration-500 ${
        isExpanded ? 'col-span-2 w-full h-[80vh]' : ''
      }`}
    >
      <div className="border-b border-purple-600 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaFolder className="text-4xl" />
          {isEditing ? (
            <input
              name="name"
              type="text"
              value={editablePortfolio.name}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md text-2xl font-bold"
              placeholder="Portfolio Name"
            />
          ) : (
            <h3 className="text-2xl font-bold">{portfolio.name}</h3>
          )}
        </div>
        <div className="flex space-x-2">
          {!isEditing &&
            (isExpanded ? (
              <button
                onClick={onContract}
                className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 text-sm"
              >
                Close
              </button>
            ) : (
              <button
                onClick={onExpand}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-3 py-1 text-sm"
              >
                Recommendations
              </button>
            ))}
          {!isExpanded && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Delete
              </button>
            </>
          )}
          {isEditing && (
            <>
              <button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body content */}
      {isExpanded ? (
        <RecommendationsPanel portfolioId={portfolio.id} />
      ) : isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description:</label>
            <textarea
              name="description"
              value={editablePortfolio.description}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md w-full"
              placeholder="Portfolio Description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Strategy (ID):</label>
            <input
              name="strategy"
              type="text"
              value={editablePortfolio.strategy}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md w-full"
              placeholder="Portfolio Strategy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency:</label>
            <select
              name="currency"
              value={editablePortfolio.currency}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md w-full"
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <>
          {/* Normal view content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <p className="flex items-center">
                <span className="font-medium mr-2">Strategy:</span>
                <div className="flex items-center bg-gray-200 text-purple-700 rounded-full px-2 py-1">
                  <FaChartLine className="mr-1" />
                  <span>{portfolio.strategy_name}</span>
                </div>
              </p>
              <p className="flex items-center">
                <span className="font-medium mr-2">Currency:</span>
                <div className="flex items-center bg-gray-200 text-purple-700 rounded-full px-2 py-1">
                  <FaDollarSign className="mr-1" />
                  <span>{portfolio.currency}</span>
                </div>
              </p>
              <p className="flex items-center">
                <span className="font-medium mr-2">Description:</span>
                <span>{portfolio.description}</span>
              </p>
            </div>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <p>
                <span className="font-medium mr-2">Created:</span>
                <span>{new Date(portfolio.created_at).toLocaleString()}</span>
              </p>
              <p>
                <span className="font-medium mr-2">Updated:</span>
                <span>{new Date(portfolio.updated_at).toLocaleString()}</span>
              </p>
              <p>
                <span className="font-medium mr-2">ID:</span>
                <span>{portfolio.id}</span>
              </p>
            </div>
          </div>
        </>
      )}

      {notification.message && (
        <Notification
          message={notification.message}
          success={notification.success}
          onClear={() => setNotification({ message: '', success: false })}
        />
      )}
    </div>
  );
}