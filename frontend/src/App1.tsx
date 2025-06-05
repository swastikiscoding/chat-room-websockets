// import React from 'react'

import { useEffect, useState } from "react";

const App = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    socket.onmessage = (message) => {
      console.log("Message from server:", message.data);
      setMessages((prevMessages) => [...prevMessages, message.data]);
    };
    setSocket(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  if (!socket) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="animate-pulse flex space-x-2">
        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
        <span className="ml-2">Connecting...</span>
      </div>
    </div>;
  }
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
          <h1 className="text-2xl font-bold text-white">WebSocket Messages</h1>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center italic">No messages yet</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg, index) => (
                <li 
                  key={index} 
                  className="p-3 bg-gray-700 rounded-lg shadow-md text-gray-200 break-words border-l-4 border-indigo-500 hover:bg-gray-600 transition-colors duration-200"
                >
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-700 p-4 bg-gray-900">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const message = (e.target as HTMLInputElement).value;
                  socket.send(message);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
              placeholder="Type a message and press Enter"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;