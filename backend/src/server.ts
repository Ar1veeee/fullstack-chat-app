import { connectDB } from "./lib/db";
import { config } from "dotenv-safe";
import { server } from "./lib/socket";
import "./app";
config();

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is listen on PORT:${PORT}`)
    connectDB()
})