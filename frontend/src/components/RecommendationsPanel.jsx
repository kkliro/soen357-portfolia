import React, { useEffect, useState, useContext } from 'react';
import { recommendPortfolio } from '../hooks/portfolio';
import { AuthContext } from '../context/AuthContext';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { FaChartBar, FaNewspaper } from 'react-icons/fa';

export default function RecommendationsPanel({ portfolioId }) {
    const { token } = useContext(AuthContext);
    const [recommendData, setRecommendData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await recommendPortfolio(portfolioId, token);
                setRecommendData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [portfolioId, token]);

    if (loading) {
        return <div className="text-white text-center mt-20">Loading recommendations...</div>;
    }

    const progressData =
        recommendData?.monthly_performance?.realized
            ? Object.entries(recommendData.monthly_performance.realized).map(
                  ([date, value]) => ({
                      date,
                      value,
                  })
              )
            : [];

    const overallRecommendation = recommendData?.recommendation || "";
    const stocksAnalysis = recommendData?.stocks_analysis || [];

    return (
        <div className="w-full bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg border border-transparent max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Portfolio Progress</h2>
            {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={progressData}
                        margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#6366F1"
                            fillOpacity={1}
                            fill="url(#colorProgress)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-white">No progress data available.</p>
            )}

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-white">Overall Recommendation</h2>
                <p className="mt-2 text-white">{overallRecommendation}</p>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-white">Stocks Analysis</h2>
                {stocksAnalysis.length > 0 ? (
                    <div className="mt-4 space-y-6">
                        {stocksAnalysis.map((stock, index) => (
                            <div
                                key={index}
                                className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg border border-purple-800"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-white">{stock.symbol}</h3>
                                    <FaChartBar className="text-white" />
                                </div>

                                <div className="my-2">
                                    <div className="flex justify-between text-sm text-gray-200">
                                        <span>
                                            Current: $
                                            {stock.current_price ? stock.current_price.toFixed(2) : "N/A"}
                                        </span>
                                        <span>
                                            Avg Last Week: $
                                            {stock.average_price_last_week
                                                ? stock.average_price_last_week.toFixed(2)
                                                : "N/A"}
                                        </span>
                                    </div>
                                    {stock.current_price && stock.average_price_last_week && (
                                        <div className="mt-1 w-full bg-gray-700 h-2 rounded overflow-hidden">
                                            {(() => {
                                                const max = Math.max(
                                                    stock.current_price,
                                                    stock.average_price_last_week
                                                );
                                                const currPerc =
                                                    (stock.current_price / max) * 100;
                                                const avgPerc =
                                                    (stock.average_price_last_week / max) * 100;
                                                const currentColor =
                                                    stock.current_price > stock.average_price_last_week
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500';
                                                const avgColor =
                                                    stock.current_price > stock.average_price_last_week
                                                        ? 'bg-red-500'
                                                        : 'bg-green-500';
                                                return (
                                                    <div className="flex">
                                                        <div
                                                            className={`${currentColor} h-2`}
                                                            style={{ width: `${currPerc}%` }}
                                                        ></div>
                                                        <div
                                                            className={`${avgColor} h-2`}
                                                            style={{ width: `${avgPerc}%` }}
                                                        ></div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-200 mb-1">
                                    Quantitative: {stock.quantitative_assessment}
                                </p>
                                <p className="text-sm text-gray-200 mb-2">
                                    Qualitative: {stock.qualitative_assessment}
                                </p>

                                {stock.news && stock.news.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex items-center mb-1">
                                            <FaNewspaper className="text-white mr-2" />
                                            <h4 className="font-semibold text-white">
                                                Latest News
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            {stock.news.map((article, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-gray-800 bg-opacity-60 p-2 rounded-md"
                                                >
                                                    <h5 className="text-sm text-white font-medium">
                                                        {article.content && article.content.title
                                                            ? article.content.title
                                                            : 'No Title'}
                                                    </h5>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white mt-4">No stocks analysis available.</p>
                )}
            </div>
        </div>
    );
}