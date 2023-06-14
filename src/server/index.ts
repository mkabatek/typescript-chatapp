import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  let username: string;

  socket.on("set username", (name: string) => {
    username = name;
    console.log(`user ${username} connected`);
    socket.broadcast.emit("user connected", username);
  });

  socket.on("chat message", (msg: string) => {
    console.log(`message from ${username}: ${msg}`);
    io.emit("chat message", { username, message: msg });
  });

  socket.on("disconnect", () => {
    console.log(`user ${username} disconnected`);
    socket.broadcast.emit("user disconnected", username);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
