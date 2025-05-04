import { Server } from "socket.io";
import http from "http";
import express from "express";
import { config } from "dotenv-safe";
config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.FRONTEND_URL,
    }
});
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
// store user online
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if (userId && typeof userId === 'string') {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
export { io, app, server };
