import mongoose from "mongoose";
import { initDb } from "./seed";

await initDb()
await mongoose.connection.close()