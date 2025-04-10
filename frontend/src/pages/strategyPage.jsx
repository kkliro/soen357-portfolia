import React, { useState, useEffect, useContext } from 'react';
import HeaderComponent from '../components/HeaderComponent.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { listStrategies } from '../hooks/strategy.js';
import StrategyCard from '../components/StrategyCard.jsx';
import CreateStrategyPopup from '../components/CreateStrategyPopup.jsx';

export default function StrategyPage() {
    const { token } = useContext(AuthContext);
    const [strategies, setStrategies] = useState([]);
    const [error, setError] = useState(null);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

    const fetchStrategies = async () => {
        try {
            const data = await listStrategies(token);
            setStrategies(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchStrategies();
        }
    }, [token]);

    const handleStrategyCreated = (newStrategy) => {
        setStrategies((prevStrategies) => [...prevStrategies, newStrategy]);
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
                        <h2 className="text-3xl font-semibold text-white">Strategy Overview</h2>
                        <button
                            onClick={() => setIsCreatePopupOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                        >
                            Create Strategy
                        </button>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {strategies.map((strategy) => (
                            <StrategyCard 
                                key={strategy.id} 
                                strategy={strategy} 
                                onStrategyUpdated={fetchStrategies} 
                            />
                        ))}
                    </div>
                </main>
                {isCreatePopupOpen && (
                    <CreateStrategyPopup
                        closeModal={() => setIsCreatePopupOpen(false)}
                        onStrategyCreated={handleStrategyCreated}
                    />
                )}
            </div>
        </div>
    );
}