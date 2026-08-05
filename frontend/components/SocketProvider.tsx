'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { SOCKET_EVENTS, OutbidEvent } from '@/lib/socketEvents';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // If not authenticated, or no token, disconnect any existing socket and return
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Connect or reconnect with new token
    const newSocket = io(API_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on(SOCKET_EVENTS.CONNECT, () => {

    });

    newSocket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {

    });

    newSocket.on('connect_error', (err) => {

    });

    // Global listeners
    newSocket.on(SOCKET_EVENTS.OUTBID, (data: OutbidEvent) => {
      toast.error(
        `You have been outbid! Current highest bid is ₹${data.highestBid}`,
        { duration: 5000, position: 'top-right' }
      );
    });

    setSocket(newSocket);

    // Cleanup on unmount or token change
    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
