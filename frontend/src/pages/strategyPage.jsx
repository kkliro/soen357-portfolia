import React, { useState, useEffect, useContext } from 'react';
import HeaderComponent from '../components/HeaderComponent.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { listStrategies } from '../hooks/strategy.js';
import StrategyCard from '../components/StrategyCard.jsx';

export default function StrategyPage() {
    const { token } = useContext(AuthContext);
    const [strategies, setStrategies] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col">
            <HeaderComponent />
            <main className="pt-20 px-6 md:px-20 py-10 flex-1">
                <h2 className="text-3xl font-semibold mb-6 text-white">Strategy Overview</h2>
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
        </div>
    );
}