import app from "./server.js"
import { connectDB } from "./lib/db.js"

connectDB()

export default app
