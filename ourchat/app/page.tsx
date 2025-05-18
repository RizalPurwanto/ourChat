"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSocket } from "./components/SocketProvider";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const socket = useSocket();

  // useEffect(() => {
  //   function onHello(msg: string) {
  //     console.log("ON MESSAGE")
  //     setMessages((prev) => [...prev, msg]); //this will add new message to existing array of messages
  //   }

  //   socket.on("message", onHello);

  //   return () => {
  //     socket.off("message", onHello);
  //   }
  // }, [])

  // useEffect(() => {
  //   if (socket.connected) {
  //     onConnect();
  //   }

  //   function onHello(msg: string) {
  //     console.log("ON MESSAGE")
  //     setMessages((prev) => [...prev, msg]); //this will add new message to existing array of messages
  //   }

  //   function onConnect() {
  //     setIsConnected(true);
  //     setTransport(socket.io.engine.transport.name);

  //     socket.io.engine.on("upgrade", (transport) => {
  //       setTransport(transport.name);
  //     });
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //     setTransport("N/A");
  //   }

  //   socket.on("message", onHello);
  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);

  //   return () => {
  //     console.log("CLEANUP PHASE")
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.off("message", onHello);
  //   };
  // }, []);

  useEffect(() => {
    if (!socket) return;
    console.log("Socket connected");

    function onConnect() {
      if (!socket) return

      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("sendMessage", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);


    return () => {
      socket.off("sendMessage");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };

  }, [socket]);

  const sendMessage = () => { //function to send message

    if (!socket) {
      alert(`Socket NOT CONNECTED`)
      return
    }
    console.log("EMIT MESSAGE")
    console.log(socket.connected)

    socket.emit("sendMessage", message); //sending message, emit here is to tell the server we're sending something under the key "message"
    setMessages((prev) => [...prev, message]); //update the sender's array of messages with the newly sent message
    setMessage(""); //reset the mssage input
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <div>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>

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

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
