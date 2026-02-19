import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();

export const server = http.createServer(app);

// storing online users
const userSocketMap = {}; // object format of { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // returns a socketId of the user
}

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5000"]
  }
});

io.on("connection", function(socket) {
  // console.log(`user is conneced ${socket.id}`);

  const { userId } = socket.handshake.query;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log(`user is disconnected ${socket.id}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
