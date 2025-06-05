import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (url: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log(`[useSocket] Connecting to: ${url}`);
    const socketConnection = io(url);

    socketConnection.on("connect", () => {
      console.log(
        `[useSocket] Connected successfully with ID: ${socketConnection.id}`
      );
    });

    socketConnection.on("connect_error", (error) => {
      console.error(`[useSocket] Connection error:`, error);
    });

    socketConnection.on("disconnect", (reason) => {
      console.log(`[useSocket] Disconnected: ${reason}`);
    });

    setSocket(socketConnection);

    return () => {
      console.log(`[useSocket] Cleaning up socket connection`);
      socketConnection.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;