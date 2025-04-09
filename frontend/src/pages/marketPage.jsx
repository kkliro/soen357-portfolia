import React, { useState, useContext } from 'react';
import { useFinanceData } from '../hooks/finance';
import { AuthContext } from '../context/AuthContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Brush,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import HeaderComponent from '../components/headerComponent.jsx';

export default function MarketPage() {
    const { token } = useContext(AuthContext);

    const [symbol, setSymbol] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [query, setQuery] = useState(null);

    const { data: info, loading: infoLoading, error: infoError } = useFinanceInfo(query?.symbol, token);

    const { data: stockData, loading: dataLoading, error: dataError } = useFinanceData(query, token);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (symbol && startDate && endDate) {
            setQuery({
                symbol: symbol,
                start_date: startDate,
                end_date: endDate,
            });
        }
    };

    let chartData = [];
    let marketDetails = null;
    if (stockData && !Array.isArray(stockData)) {
        marketDetails = stockData;
        chartData = Array.isArray(stockData.historical_data)
            ? stockData.historical_data.map(item => ({
                  ...item,
                  Date: new Date(item.Date).toLocaleDateString(),
              }))
            : [];
    } else if (Array.isArray(stockData)) {
        chartData = stockData.map(item => ({
              ...item,
              Date: new Date(item.Date).toLocaleDateString(),
          }));
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <HeaderComponent />
            <main className="px-6 md:px-20 py-10 flex-1">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
                    Market Data
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1">
                            <label className="text-purple-300 text-sm">Stock Symbol</label>
                            <input
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                className="w-full p-2 rounded-md mt-1 bg-gray-800 text-white border border-purple-500"
                                placeholder="e.g. AAPL"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-purple-300 text-sm">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 rounded-md mt-1 bg-gray-800 text-white border border-purple-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-purple-300 text-sm">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 rounded-md mt-1 bg-gray-800 text-white border border-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {infoLoading ? (
                    <p className="text-purple-300">Loading stock info...</p>
                ) : infoError ? (
                    <p className="text-red-500">Error: {infoError.message}</p>
                ) : info ? (
                    <div className="mb-6 bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold text-purple-300">{info.longName || info.shortName}</h3>
                        <p>Symbol: {info.symbol}</p>
                        <p>
                            Market Price: {info.regularMarketPrice} {info.currency}
                        </p>
                    </div>
                ) : null}

                {query && (
                    <>
                        {dataLoading ? (
                            <p className="text-purple-300">Loading stock data...</p>
                        ) : dataError ? (
                            <p className="text-red-500">Error: {dataError.message}</p>
                        ) : marketDetails ? (
                            <>
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
                                        <h3 className="text-lg font-bold text-purple-300 mb-2">{marketDetails.asset_name}</h3>
                                        <p><span className="font-medium">Symbol:</span> {marketDetails.symbol}</p>
                                        <p><span className="font-medium">Type:</span> {marketDetails.type}</p>
                                        <p><span className="font-medium">Sector:</span> {marketDetails.sector}</p>
                                        <p><span className="font-medium">Industry:</span> {marketDetails.industry}</p>
                                    </div>
                                    <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
                                        <h3 className="text-lg font-bold text-purple-300 mb-2">Pricing</h3>
                                        <p>
                                            <span className="font-medium">Current Price:</span> ${marketDetails.current_price}
                                        </p>
                                        <p>
                                            <span className="font-medium">Market Cap:</span> ${marketDetails.market_cap.toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-medium">Trailing PE:</span> {marketDetails.trailing_pe}
                                        </p>
                                        <p>
                                            <span className="font-medium">Forward PE:</span> {marketDetails.forward_pe}
                                        </p>
                                    </div>
                                    <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
                                        <h3 className="text-lg font-bold text-purple-300 mb-2">Dividends & Stats</h3>
                                        <p>
                                            <span className="font-medium">Dividend Yield:</span> {marketDetails.dividend_yield}%
                                        </p>
                                        <p>
                                            <span className="font-medium">Dividend Rate:</span> {marketDetails.dividend_rate}
                                        </p>
                                        <p>
                                            <span className="font-medium">Beta:</span> {marketDetails.beta}
                                        </p>
                                        <p>
                                            <span className="font-medium">52 wk High:</span> {marketDetails["52_week_high"]}
                                        </p>
                                        <p>
                                            <span className="font-medium">52 wk Low:</span> {marketDetails["52_week_low"]}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6 bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
                                    <h3 className="text-lg font-bold text-purple-300 mb-4">Stock Price Over Time</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                            <XAxis dataKey="Date" stroke="#FFFFFF" />
                                            <YAxis stroke="#FFFFFF" />
                                            <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#fff" }} />
                                            <Line
                                                type="monotone"
                                                dataKey="Close"
                                                stroke="#8B5CF6"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                            <Brush dataKey="Date" height={30} stroke="#8B5CF6" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
                                    <h3 className="text-lg font-bold text-purple-300 mb-4">Trading Volume</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                            <XAxis dataKey="Date" stroke="#FFFFFF" />
                                            <YAxis stroke="#FFFFFF" />
                                            <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#fff" }} />
                                            <Bar dataKey="Volume" fill="#8B5CF6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : (
                            <p className="text-purple-300">No stock data available.</p>
                        )}
                    </>
                )}

                {!query && (
                    <p className="text-purple-300">
                        Please enter a stock symbol with start and end dates to view data.
                    </p>
                )}
            </main>
        </div>
    );
}