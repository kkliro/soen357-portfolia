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
    <div className="bg-indigo-900/20 shadow-lg rounded-xl p-6 text-white ring-2 ring-indigo-500 flex flex-col">
      {/* Header with icon and title */}
      <div className="border-b border-indigo-700 pb-2 mb-4 flex items-center justify-between">
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
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1 text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body content */}
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Description:</label>
            <textarea
              name="description"
              value={editablePortfolio.description}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md w-full"
              placeholder="Description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Strategy:</label>
            <input
              name="strategy"
              type="text"
              value={editablePortfolio.strategy}
              onChange={handleChange}
              className="bg-white text-black p-2 rounded-md w-full"
              placeholder="Strategy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Currency:</label>
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
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <p className="flex items-center">
                <span className="font-medium mr-2">Description:</span>
                <span>{portfolio.description}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium mr-2">Strategy:</span>
                <span>{portfolio.strategy}</span>
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="flex items-center">
                <span className="font-medium mr-2">Currency:</span>
                <span>{portfolio.currency}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-400">
            <p>
              <span className="font-medium">ID:</span> {portfolio.id}
            </p>
            <p>
              <span className="font-medium">Created:</span> {new Date(portfolio.created_at).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Updated:</span> {new Date(portfolio.updated_at).toLocaleString()}
            </p>
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