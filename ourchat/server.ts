import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production"; //true or false
const hostname = "localhost";
const port = 3000;

//using next's middleware needs `hostname` and `port` to be provided below

const app = next({ dev, hostname, port }); //initiate app server
const handler = app.getRequestHandler(); //get the Requesthandler, function that intercept/receive client request, and handle them



app.prepare().then(() => {
    const httpServer = createServer(handler); //create httpserver using the handler

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }); //instantiate websocket server

    io.on("connection", (socket) => {
        //... insert anything to do on "connection event"
        console.log('A user connected:', socket.id);

        socket.on('sendMessage', (message: string) => {
            socket.emit('sendMessage', message)
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    })

    io.on("hello", (msg) => console.log(msg))

    httpServer.once("error", (err) => { //handle when httpserver encounters error
        console.error(err);
        process.exit(1); //exit code 1 is exit due to error
    }).listen(port, () => { //listen to the server
        console.log(`==> Ready on http://${hostname}:${port}`);
    });
});