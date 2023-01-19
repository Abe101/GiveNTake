import React, {createContext, useContext} from 'react';
import {io, Socket} from 'socket.io-client';

import {BASE} from '../constants/api';

export const socket = io(BASE);
export const SocketContext = createContext<Socket>(socket);

export const SocketProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext) as Socket;
