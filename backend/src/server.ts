import { connectDB } from "./lib/db.js";
import { config } from "dotenv-safe";
import { server } from "./lib/socket.js";
import "./app.js";
config();

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is listen on PORT:${PORT}`)
    connectDB()
})