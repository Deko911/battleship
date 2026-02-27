import mongoose from "mongoose";
import config from "./config";

const DB_URI = process.env.NODE_ENV === 'test' ? config.TEST_MONGODB_URI : config.MONGODB_URI

export default async function connectDB() {
    try {
        await mongoose.connect(DB_URI)
        console.log('DB running')
    } catch (e) {
        console.error('Error in DB:', e)
        process.exit(0) 
    }
}