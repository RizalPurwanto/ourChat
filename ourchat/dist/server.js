"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const dev = process.env.NODE_ENV !== "production"; //true or false
const hostname = "localhost";
const port = 3000;
//using next's middleware needs `hostname` and `port` to be provided below
const app = (0, next_1.default)({ dev, hostname, port }); //initiate app server
const handler = app.getRequestHandler(); //get the Requesthandler, function that intercept/receive client request, and handle them
app.prepare().then(() => {
    const httpServer = (0, node_http_1.createServer)(handler); //create httpserver using the handler
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }); //instantiate websocket server
    io.on("connection", (socket) => {
        //... insert anything to do on "connection event"
        console.log('A user connected:', socket.id);
        socket.on('sendMessage', (message) => {
            socket.broadcast.emit('sendMessage', message);
        });
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
    io.on("hello", (msg) => console.log(msg));
    httpServer.once("error", (err) => {
        console.error(err);
        process.exit(1); //exit code 1 is exit due to error
    }).listen(port, () => {
        console.log(`==> Ready on http://${hostname}:${port}`);
    });
});
