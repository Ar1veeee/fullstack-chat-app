import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import testRoutes from "./routes/test.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { app, server } from "./lib/socket.js"
import { connectDB } from "./lib/db.js"
import { config } from "dotenv-safe"
config()

const __dirname = path.resolve()

// Express middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.FRONTEND_URL,
    credentials: true,
}))

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)
app.use("/api", testRoutes)

// Static files serving for production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend", "dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

// Start server
const PORT = process.env.PORT || 5001

server.listen(PORT, () => {
    console.log(`Server is listening on PORT:${PORT}`)
    connectDB()
})

export default app