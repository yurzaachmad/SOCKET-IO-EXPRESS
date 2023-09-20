const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (room, sender, receiver) => {
    console.log("message", room, receiver);
    io.to(room).emit("messageReceived", sender, receiver);
  });

  socket.on("join", (room, receiver) => {
    console.log("join room", room);
    socket.join(room);
    if (receiver) {
      socket.broadcast.emit("invite", room, receiver);
    }
  });
});

server.listen(3001, () => {
  console.log("socket listening on *:3001");
});
