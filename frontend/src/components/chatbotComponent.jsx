import React, { useState, useContext, useEffect } from 'react';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import { useChatbotPrompt } from '../hooks/chatbot';

export default function ChatbotComponent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const { token } = useContext(AuthContext);
  const { data, loading, error, sendPrompt } = useChatbotPrompt(token);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    sendPrompt(input);
    setInput('');
  };

  useEffect(() => {
    if (data) {
      const botText =
        typeof data === 'object'
          ? (data.response ? data.response : JSON.stringify(data))
          : data;
      setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setMessages(prev => [
        ...prev,
        { text: "Error: " + error.message, sender: 'bot' }
      ]);
    }
  }, [error]);

  return (
    <div className="fixed bottom-4 right-4">
      {open ? (
        <div className="w-96 h-[500px] bg-gray-800 rounded-lg shadow-xl flex flex-col">
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <span>PortfoliaAI</span>
            <button onClick={() => setOpen(false)} className="text-white">
              X
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === 'user' ? "text-right" : "text-left"}
              >
                <span
                  className={`inline-block p-2 rounded ${
                    msg.sender === 'user'
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.text}
                  {loading && msg.sender === 'bot' && " ..."}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Type your message..."
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 bg-purple-200 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform duration-200"
        >
          <img src={logo} alt="Chatbot Logo" className="w-10 h-10" />
        </button>
      )}
    </div>
  );
}