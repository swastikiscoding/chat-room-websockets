import { type FC } from 'react';

interface SystemMessageProps {
  message: string;
  timestamp: Date;
}

const SystemMessage: FC<SystemMessageProps> = ({ message, timestamp }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="flex justify-center mb-4">
      <div className="bg-gray-800/70 text-gray-300 rounded-full px-4 py-2 text-xs max-w-[90%] text-center backdrop-blur-sm shadow-sm">
        <span>{message}</span>
        <span className="text-xs text-gray-400 ml-2">{formattedTime}</span>
      </div>
    </div>
  );
};

export default SystemMessage;
