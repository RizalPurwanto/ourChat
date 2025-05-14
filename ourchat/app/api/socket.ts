import { Server } from "socket.io";

export default function handler(req:any, res:any) { 
    if(!res.socket.server.io) {
        console.log("Starting socket io server");
    }
}