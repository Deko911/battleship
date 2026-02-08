import express from "express";
import helmet from "helmet";
import cors from "cors";
import config from "./utils/config";

const app = express();
const port = config.PORT;

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});
