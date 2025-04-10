import React, { useState, useContext } from 'react';
import { updateStrategy, deleteStrategy } from '../hooks/strategy.js';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';
import { 
    FaChartLine, 
    FaExclamationTriangle, 
    FaBalanceScale, 
    FaShieldAlt, 
    FaDollarSign, 
    FaClock, 
    FaLayerGroup,
    FaIndustry
} from 'react-icons/fa';

const RISK_LEVELS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

const INVESTMENT_TYPES = [
    { value: 'stocks', label: 'Stocks' },
    { value: 'bonds', label: 'Bonds' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'index_funds', label: 'Index Funds' },
    { value: 'etfs', label: 'ETFs' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'mixed', label: 'Mixed' },
];

function getRiskIcon(risk) {
    if (risk === 'high') return <FaExclamationTriangle className="inline text-red-500" />;
    if (risk === 'medium') return <FaBalanceScale className="inline text-yellow-500" />;
    return <FaShieldAlt className="inline text-green-500" />;
}

export default function StrategyCard({ strategy, onStrategyUpdated }) {
    const { token } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editableStrategy, setEditableStrategy] = useState({
        name: strategy.name,
        risk_tolerance: strategy.risk_tolerance,
        investment_type: strategy.investment_type,
        target_return: strategy.target_return,
        investment_horizon: strategy.investment_horizon,
        diversification_level: strategy.diversification_level,
        automated_trading: strategy.automated_trading,
    });

    const [notification, setNotification] = useState({ message: '', success: false });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditableStrategy(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            await updateStrategy(strategy.id, token, editableStrategy);
            setNotification({ message: 'Update succeeded', success: true });
            setIsEditing(false);
            if (onStrategyUpdated) onStrategyUpdated();
        } catch (error) {
            console.error(error);
            setNotification({ message: 'Update failed', success: false });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteStrategy(strategy.id, token);
            setNotification({ message: 'Deletion succeeded', success: true });
            if (onStrategyUpdated) onStrategyUpdated();
        } catch (error) {
            console.error(error);
            setNotification({ message: 'Deletion failed', success: false });
        }
    };

    const handleCancel = () => {
        setEditableStrategy({
            name: strategy.name,
            risk_tolerance: strategy.risk_tolerance,
            investment_type: strategy.investment_type,
            target_return: strategy.target_return,
            investment_horizon: strategy.investment_horizon,
            diversification_level: strategy.diversification_level,
            automated_trading: strategy.automated_trading,
        });
        setIsEditing(false);
    };

    const borderClass = strategy.risk_tolerance === 'high' 
        ? 'ring-red-500' 
        : strategy.risk_tolerance === 'medium' 
            ? 'ring-yellow-500' 
            : 'ring-green-500';

    return (
        <div className={`bg-purple-600/10 shadow-lg rounded-xl p-6 text-white ring-2 ${borderClass} flex flex-col transition-all duration-500`}>
            {/* Header Section */}
            <div className="border-b border-purple-600 pb-2 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <FaChartLine className="text-4xl" />
                    {isEditing ? (
                        <input
                            name="name"
                            type="text"
                            value={editableStrategy.name}
                            onChange={handleChange}
                            className="bg-white text-black p-2 rounded-md text-2xl font-bold"
                        />
                    ) : (
                        <h3 className="text-2xl font-bold">{strategy.name}</h3>
                    )}
                    <span className="flex items-center">
                        {getRiskIcon(strategy.risk_tolerance)}
                        <span className="ml-1 text-sm">
                            {strategy.risk_tolerance.toUpperCase()} RISK
                        </span>
                    </span>
                </div>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 text-sm">Cancel</button>
                            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-sm">Save</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-3 py-1 text-sm">Edit</button>
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 text-sm">Delete</button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Risk Tolerance:</label>
                        <select 
                            name="risk_tolerance" 
                            value={editableStrategy.risk_tolerance} 
                            onChange={handleChange} 
                            className="bg-white text-black p-2 rounded-md w-full"
                        >
                            {RISK_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Investment Type:</label>
                        <select 
                            name="investment_type" 
                            value={editableStrategy.investment_type} 
                            onChange={handleChange} 
                            className="bg-white text-black p-2 rounded-md w-full"
                        >
                            {INVESTMENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Target Return (%):</label>
                        <input 
                            name="target_return" 
                            type="number" 
                            value={editableStrategy.target_return} 
                            onChange={handleChange} 
                            className="bg-white text-black p-2 rounded-md w-full" 
                            step="0.01" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Investment Horizon (years):</label>
                        <input 
                            name="investment_horizon" 
                            type="number" 
                            value={editableStrategy.investment_horizon} 
                            onChange={handleChange} 
                            className="bg-white text-black p-2 rounded-md w-full" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Diversification Level (1-10):</label>
                        <input 
                            name="diversification_level" 
                            type="number" 
                            value={editableStrategy.diversification_level} 
                            onChange={handleChange} 
                            className="bg-white text-black p-2 rounded-md w-full" 
                            min="1" 
                            max="10" 
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="text-sm font-medium mr-2">Automated Trading:</label>
                        <input 
                            name="automated_trading" 
                            type="checkbox" 
                            checked={editableStrategy.automated_trading} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <p className="flex items-center">
                                <FaDollarSign className="mr-2" />
                                <span className="font-medium inline-block w-40">Target Return:</span> 
                                <span>{strategy.target_return}%</span>
                            </p>
                            <p className="flex items-center">
                                <FaClock className="mr-2" />
                                <span className="font-medium inline-block w-40">Investment Horizon:</span> 
                                <span>{strategy.investment_horizon} {strategy.investment_horizon === 1 ? 'year' : 'years'}</span>
                            </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p className="flex items-center">
                                <FaIndustry className="mr-2" />
                                <span className="font-medium inline-block w-40">Investment Type:</span>
                                <span className="ml-2">{strategy.investment_type}</span>
                            </p>
                            <p className="flex items-center">
                                <FaLayerGroup className="mr-2" />
                                <span className="font-medium inline-block w-40">Diversification:</span> 
                                <span>{strategy.diversification_level} / 10</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-400">
                        <p>ID: {strategy.id}</p>
                        <p>Created: {new Date(strategy.created_at).toLocaleString()}</p>
                        <p>Updated: {new Date(strategy.updated_at).toLocaleString()}</p>
                        <p className="col-span-3 text-right">
                            Automated Trading:{" "}
                            <span className={`${strategy.automated_trading ? 'text-green-500' : 'text-red-500'}`}>
                                {strategy.automated_trading ? 'On' : 'Off'}
                            </span>
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