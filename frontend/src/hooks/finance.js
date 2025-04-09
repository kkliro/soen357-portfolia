import axios from "axios";
import { useState, useEffect } from "react";

export function useFinanceInfo(symbol, token) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!symbol || !token) return;

        const fetchFinanceInfo = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/finance/info/",
                    { symbol },
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceInfo();
    }, [symbol, token]);

    return { data, loading, error };
}

export function useFinanceData(query, token) {
    const { symbol, start_date, end_date } = query || {};
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!symbol || !start_date || !end_date || !token) return;

        const fetchFinanceData = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/finance/fetch/",
                    { symbol, start_date, end_date },
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, [symbol, start_date, end_date, token]);

    return { data, loading, error };
}