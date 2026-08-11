import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(socketInstance);

  useEffect(() => {
    if (!socketInstance) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const baseUrl = apiUrl.replace('/api', '');
      
      socketInstance = io(baseUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on('connect', () => {

      });

      socketInstance.on('disconnect', () => {

      });

      setSocket(socketInstance);
    }

    return () => {
      // We don't want to disconnect the singleton instance here
      // unless we're actually unmounting the entire app, but React
      // strict mode might trigger this. 
    };
  }, []);

  return socket;
}
