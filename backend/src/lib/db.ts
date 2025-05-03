import mongoose from "mongoose";
import { config } from "dotenv-safe";
config();

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MongoDB_URL is not defined")
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error: any) {
        console.log("MongoDB connection error:", error)
    }
}
