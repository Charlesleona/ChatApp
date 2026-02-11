import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

// create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// MiddleWare setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
const PORT = process.env.port || 5000;
server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
