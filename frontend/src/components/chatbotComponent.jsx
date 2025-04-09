import React, { useState } from 'react';
import logo from '../assets/logo.png';

export default function ChatbotComponent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    // Simulate a chatbot reply after 1 second
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'This is a response from the chatbot', sender: 'bot' }]);
    }, 1000);
  };

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
              <div key={index} className={msg.sender === 'user' ? "text-right" : "text-left"}>
                <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? "bg-purple-600 text-white" : "bg-gray-700 text-white"}`}>
                  {msg.text}
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