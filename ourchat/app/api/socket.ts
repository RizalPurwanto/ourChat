import { NextApiRequest } from "next";
import { Server } from "socket.io";


export default function handler(req:NextApiRequest, res:any) { 
    if(!res?.socket?.server?.io) { //if the result of socket server io does not exists, initiate the socket server 
        console.log("Starting socket io server");
        const io = new Server(res.socket.server); //instantiate the server

        res.socket.server.io = io; //assign socket.server.io to the instantiated server

        io.on("connection", (socket) => {
            console.log("USER CONNECTED", socket.id) 
            // when the socket server connected, show this message above, along with the socket id

            socket.on("message", (msg) => {
                socket.broadcast.emit("message", msg);
                //this sends message to all user except the sender
            });

            socket.on("disconnect", () => {
                console.log("USER DISCONNECTED");
                //show through the console when the socket is disconnected
            });



        })
    }
    res.end();
}