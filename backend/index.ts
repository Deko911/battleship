import express from "express";
import helmet from "helmet";
import cors from "cors";
import config from "./utils/config";
import mongoose from "mongoose";
import apiRouter from "./api/api";
import connectDB from "./utils/db";

const app = express();
const port = config.PORT;

await connectDB()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use("/api", apiRouter)


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});
