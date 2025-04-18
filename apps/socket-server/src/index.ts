import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Redis from "ioredis";
import bodyParser from "body-parser";
import cors from "cors";

const app:Express = express();
app.use(bodyParser.json());
app.use(cors());

const httpServer = createServer(app);

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10); 

const redisCache = new Redis({
  host: redisHost,
  port: redisPort,
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3002","https://codepulse.sagnik-dev.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("setUserId", async (userId: string) => {
    console.log("Setting user id to connection id", userId, socket.id);
    await redisCache.set(userId, socket.id);
  });

  socket.on("getConnectionId", async (userId: string) => {
    const connId = await redisCache.get(userId);
    console.log("Getting connection id for user id", userId, connId);
    socket.emit("connectionId", connId);
    const everything = await redisCache.keys("*");
    console.log(everything);
  });
});

app.post("/sendPayload", async (req: Request, res: Response) => {
  console.log(req.body);
  const { userId, payload }: { userId: string; payload: any } = req.body;
  
  if (!userId || !payload) {
    res.status(400).send("Invalid request");
    return;
  }
  
  const socketId = await redisCache.get(userId);
  if (socketId) {
    io.to(socketId).emit("submissionPayloadResponse", payload);
    res.send("Payload sent successfully");
  } else {
    res.status(404).send("User not connected");
  }
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
