"use client";

import { useEffect, useState } from "react";
import { socket } from "../../socket";




export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => { //when page loads, listen to the message, stop listen when exiting page

        //listen to messages from server
        socket.on("message", (msg) => {
            setMessages((prev) => [...prev, msg]); //this will add new message to existing array of messages
        });

        return () => {
            socket.disconnect();
        };


    }, [])

    const sendMessage = () => { //function to send message
        socket.emit("message", message); //sending message, emait here is to tell the server we're sending something under the key "message"
        setMessages((prev) => [...prev, message]); //update the sender's array of messages with the newly sent message
        setMessage(""); //reset the mssage input
    };

    return (
        <div>
            <h1>Real-Time Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
};