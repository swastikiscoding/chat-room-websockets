// filepath: e:\PROGRAMMING\ws nodejs\frontend\src\pages\RoomPage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import ChatMessage from "../components/ChatMessage";
import SystemMessage from "../components/SystemMessage";
 

interface Message {
  id: string;
  type: 'chat' | 'system';
  username?: string;
  message: string;
  timestamp: Date;
}

type UserColors = {
  [username: string]: number;
};

const RoomPage = () => {
    const { roomCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const userName = location.state?.userName;
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [userColors, setUserColors] = useState<UserColors>({});
    const [users, setUsers] = useState<string[]>([]);
    const [colorCounter, setColorCounter] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasJoinedRef = useRef(false);
    
    // Use the custom hook
    const socketURL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
    const socket = useSocket(socketURL);

    // Redirect if no user name
    useEffect(() => {
        console.log("[RoomPage] User data:", { userName, roomCode });
        if (!userName) {
            console.log("[RoomPage] No username, redirecting to home");
            navigate("/");
        }
    }, [userName, navigate, roomCode]);

    // Handle socket connection and event listeners
    useEffect(() => {
        if (!socket || !userName || !roomCode) {
            console.log("[RoomPage] Missing required data:", { socket: !!socket, userName, roomCode });
            return;
        }
        
        console.log("[RoomPage] Setting up socket listeners");
        
        // Join room when component mounts (only once)
        if (!hasJoinedRef.current) {
            socket.emit("join-room", { username: userName, roomCode });
            console.log(`[RoomPage] Emitted join-room event for ${userName} to room ${roomCode}`);
            hasJoinedRef.current = true;
        }
        
        // Listen for users in room
        socket.on('room-users', (roomUsers: string[]) => {
            console.log(`[RoomPage] Received room-users event:`, roomUsers);
            setUsers(roomUsers);
        });
        
        // Listen for user joined
        socket.on('user-joined', (joinMessage: string) => {
            console.log(`[RoomPage] Received user-joined event:`, joinMessage);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + Math.random().toString(),
                type: 'system',
                message: joinMessage,
                timestamp: new Date()
            }]);
        });
        
        // Listen for user left
        socket.on('user-left', (leftMessage: string) => {
            console.log(`[RoomPage] Received user-left event:`, leftMessage);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + Math.random().toString(),
                type: 'system',
                message: leftMessage,
                timestamp: new Date()
            }]);
        });
        
        // Listen for receiving messages
        socket.on('receive-message', ({ username, message }) => {
            console.log(`[RoomPage] Received message from ${username}:`, message);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + Math.random().toString(),
                type: 'chat',
                username,
                message,
                timestamp: new Date()
            }]);
        });
        
        // Clean up the event listeners when component unmounts
        return () => {
            console.log("[RoomPage] Cleaning up socket listeners");
            socket.emit("leave-room", { username: userName, roomCode });
            socket.off('room-users');
            socket.off('user-joined');
            socket.off('user-left');
            socket.off('receive-message');
            hasJoinedRef.current = false;
        };
    }, [socket, userName, roomCode]); // Removed colorCounter and userColors from dependencies
    
    // Handle user colors in a separate effect
    useEffect(() => {
        if (!users.length) return;
        
        // Assign colors to users that don't have one yet
        const updatedColors = { ...userColors };
        users.forEach(user => {
            if (!updatedColors[user]) {
                updatedColors[user] = colorCounter + Object.keys(updatedColors).length;
            }
        });
        
        if (Object.keys(updatedColors).length > Object.keys(userColors).length) {
            console.log("[RoomPage] Updating user colors:", updatedColors);
            setUserColors(updatedColors);
            setColorCounter(prev => prev + (Object.keys(updatedColors).length - Object.keys(userColors).length));
        }
    }, [users, userColors, colorCounter]);
    
    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        console.log("[RoomPage] Messages updated, scrolling to bottom");
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socket || !userName || !roomCode) {
            console.log("[RoomPage] Cannot send message:", { 
                hasMessage: !!inputMessage.trim(), 
                hasSocket: !!socket,
                hasUserName: !!userName,
                hasRoomCode: !!roomCode
            });
            return;
        }
        
        console.log(`[RoomPage] Sending message in room ${roomCode}:`, inputMessage.trim());
        socket.emit("send-message", {
            roomCode,
            username: userName,
            message: inputMessage.trim()
        });
        
        setInputMessage("");
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Header */}
            <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-3">
                            <button 
                                onClick={() => navigate("/")}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <h1 className="text-white text-xl font-bold flex items-center">
                                {userName && (
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3 text-lg font-bold">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {roomCode}
                            </h1>
                            <p className="text-gray-400 text-sm">{users.length} participant{users.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-transparent">
                <div className="container mx-auto max-w-2xl">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 my-8">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            msg.type === 'chat' ? (
                                <ChatMessage 
                                    key={msg.id}
                                    username={msg.username || ''}
                                    message={msg.message}
                                    timestamp={msg.timestamp}
                                    isCurrentUser={msg.username === userName}
                                    colorIndex={userColors[msg.username || ''] || 0}
                                />
                            ) : (
                                <SystemMessage 
                                    key={msg.id}
                                    message={msg.message}
                                    timestamp={msg.timestamp}
                                />
                            )
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            {/* Message Input */}
            <div className="bg-gray-800/70 backdrop-blur-sm border-t border-gray-700 p-4">
                <div className="container mx-auto max-w-2xl">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type message..."
                            className="flex-1 bg-gray-700 text-white rounded-full border border-gray-600 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RoomPage;