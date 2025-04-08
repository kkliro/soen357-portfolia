import React, { useState, useContext } from 'react';
import { updatePortfolio, deletePortfolio } from '../hooks/portfolio.js';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';
import { FaFolder } from 'react-icons/fa';

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'CAD', 'GBP'];

export default function PortfolioCard({ portfolio, onPortfolioUpdated }) {
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
    setEditablePortfolio(prev => ({ ...prev, [name]: value }));
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
    <div className="bg-indigo-900/20 shadow-lg rounded-xl p-6 text-white flex">
      {/* Left column: Portfolio icon */}
      <div className="flex-shrink-0 flex items-center justify-center mr-6">
        <FaFolder className="text-4xl" />
      </div>

      {/* Right column: Portfolio info and actions */}
      <div className="flex-1">
        {/* Header row with title/input and buttons */}
        <div className="flex justify-between items-center mb-2">
          {isEditing ? (
            <input
              name="name"
              type="text"
              value={editablePortfolio.name}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md w-full mr-4"
              placeholder="Portfolio Name"
            />
          ) : (
            <h3 className="text-xl font-semibold">{portfolio.name}</h3>
          )}
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body content */}
        {isEditing ? (
          <>
            <textarea
              name="description"
              value={editablePortfolio.description}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md mb-2 w-full"
              placeholder="Description"
            />
            <input
              name="strategy"
              type="text"
              value={editablePortfolio.strategy}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md mb-2 w-full"
              placeholder="Strategy"
            />
            <select
              name="currency"
              value={editablePortfolio.currency}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md w-full"
            >
              {SUPPORTED_CURRENCIES.map(curr => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <p className="mb-2">{portfolio.description}</p>
            <div className="text-sm mb-1">
              <span className="font-medium">Strategy:</span> {portfolio.strategy}
            </div>
            <div className="text-sm mb-1">
              <span className="font-medium">Currency:</span> {portfolio.currency}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <p>
                <span className="font-medium">ID:</span> {portfolio.id}
              </p>
              <div className="flex">
                <div className="mr-4">
                  <span className="font-medium">Created:</span> {new Date(portfolio.created_at).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {new Date(portfolio.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

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