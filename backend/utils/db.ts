import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/battleship")
        console.log('DB running')
    } catch (e) {
        console.error('Error in DB:', e)
        process.exit(0) 
    }
}