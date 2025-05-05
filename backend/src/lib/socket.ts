import { Server } from "socket.io";
import http from "http";
import express from "express";
import { config } from "dotenv-safe";
config();

const app = express();
const server = http.createServer(app);


console.log("Environment:", process.env.NODE_ENV);
console.log("Frontend URL:", process.env.FRONTEND_URL);

const io = new Server(server, {
    cors: {

        origin: process.env.NODE_ENV === "development"
            ? "http://localhost:5173"
            : [process.env.FRONTEND_URL || "", "https://your-app-domain.com"],
        methods: ["GET", "POST"],
        credentials: true
    },

    transports: ["websocket", "polling"],

    pingTimeout: 60000,
    pingInterval: 25000
});

export function getReceiverSocketId(userId: string) {
    return userSocketMap[userId];
}

interface UserSocketMap {
    [key: string]: string;
}


const userSocketMap: UserSocketMap = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (userId && typeof userId === 'string') {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    } else {
        console.error("Invalid userId received:", userId);
    }


    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });

    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
        if (userId && typeof userId === 'string') {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});


io.engine.on("connection_error", (err) => {
    console.error("Connection error:", err);
});

export { io, app, server };