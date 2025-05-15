"use client";

import { useEffect } from "react";


export default function SocketWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        fetch("/api/socket"); // Initialize the WebSocket server
    }, []);

    return (
        <div>
            {children}
        </div>
    )
}