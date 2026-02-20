import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import { connectDB } from "./lib/connectDB.js";
import { app, server } from "./lib/socket.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";

dotenv.config(); // even though the .env file is located in the root. the config is able to identify from src

// const app = express();
const __dirname = path.resolve();

// MIDDLEWARES
app.use(
  express.json({
    limit: "500kb"
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// ROUTE HANDING
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.get("/api/hello", (req, res) => {
  res.send("Hello Chatting Application!");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const port = process.env.PORT;
// app.listen(port, async () => {
//   console.log(`SERVER IS RUNNING ON PORT: ${port} 🖥️`);
//   await connectDB();
// });

server.listen(port, async () => {
  console.log(`SERVER IS RUNNING ON PORT: ${port} 🖥️`);
  await connectDB();
});
