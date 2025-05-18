"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

//this component is used to make the socket available for other component passed through it as children

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
// creating context allows component, such as this one to pass information deep down without passing props

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    //React.FC => React Functional Component type
    //React.ReactNode => Object type that is either: Boolean(ignored), null/undefined(ignored), Number, String, A React element (res. of JSX), or Array of the types mentioned

    //tl:dr, this is a provider that wraps around children component to make socket context available for all its children;

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io(); //instantiate the socket

        setSocket(socketInstance); //set the instance to the state

        return () => {
            socketInstance.disconnect();
            //when user leaves the provider, disconnect
        };

    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

//custom hook to return the context of this socket provider
export const useSocket = ():Socket|null => {
    const context = useContext(SocketContext);
    if(!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context.socket;
}
