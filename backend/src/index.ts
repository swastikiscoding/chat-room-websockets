import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleSocketConnection } from "./socket/socketHandler";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
const __dirname = path.resolve();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend port
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
