import app from "./index.js"
import { createServer } from "http"
import { Server } from "socket.io"
import { config } from "dotenv-safe"
config()

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
    console.log(`Server is listening on PORT:${PORT}`)
})
