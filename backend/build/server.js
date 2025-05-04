import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import testRoutes from "./routes/test.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { config } from "dotenv-safe";
config();
const app = express();
const __dirname = path.resolve();
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.FRONTEND_URL,
    credentials: true,
}));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api", testRoutes);
// Static files
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend", "dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}
export default app;
