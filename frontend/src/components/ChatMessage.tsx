import { type FC } from 'react';

interface ChatMessageProps {
  username: string;
  message: string;
  timestamp: Date;
  isCurrentUser: boolean;
  colorIndex: number;
}

const ChatMessage: FC<ChatMessageProps> = ({ 
  username, 
  message, 
  timestamp, 
  isCurrentUser,
  colorIndex
}) => {
  // Array of color classes for different users
  const userColors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-red-600',
    'bg-orange-600'
  ];
  
  const userColor = isCurrentUser ? 'bg-indigo-600' : userColors[colorIndex % userColors.length];
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 items-end`}>
      {!isCurrentUser && (
        <div className={`${userColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2 flex-shrink-0`}>
          {getInitial(username)}
        </div>
      )}
      
      <div className={`rounded-2xl px-4 py-3 max-w-[75%] shadow-md ${
        isCurrentUser 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-gray-700 text-white rounded-bl-none'
      }`}>
        {!isCurrentUser && (
          <div className="mb-1">
            <span className="font-medium text-sm text-gray-300">{username}</span>
          </div>
        )}
        <p className="break-words">{message}</p>
        <div className="text-right">
          <span className="text-xs text-gray-300 mt-1 inline-block">{formattedTime}</span>
        </div>
      </div>
      
      {isCurrentUser && (
        <div className={`${userColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ml-2 flex-shrink-0`}>
          {getInitial(username)}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
