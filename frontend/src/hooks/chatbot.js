import axios from "axios";
import { useState } from "react";

export function useChatbotPrompt(token) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendPrompt = async (promptText) => {
        if (!promptText || !token) {
            setError(new Error("Prompt and token are required."));
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/chatbot/prompt/",
                { prompt: promptText },
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

    return { data, loading, error, sendPrompt };
}