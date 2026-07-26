require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// --- Database setup ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const messageSchema = new mongoose.Schema({
  room: String,
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", async ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);

    if (!rooms[room]) rooms[room] = new Map();
    rooms[room].set(socket.id, username); // keyed by THIS socket's id

    io.to(room).emit("system", `${username} joined ${room}`);
    io.to(room).emit("user-list", Array.from(rooms[room].values()));

    const history = await Message.find({ room }).sort({ timestamp: -1 }).limit(50);
    socket.emit("history", history.reverse());
  });

  socket.on("message", async (text) => {
    const msg = { room: socket.room, user: socket.username, text };
    io.to(socket.room).emit("message", msg);
    await Message.create(msg);
  });

  socket.on("typing", () => socket.to(socket.room).emit("typing", socket.username));
  socket.on("stop-typing", () => socket.to(socket.room).emit("stop-typing", socket.username));

  socket.on("disconnect", () => {
    if (socket.room && rooms[socket.room]) {
      rooms[socket.room].delete(socket.id); // only removes THIS socket's entry
      io.to(socket.room).emit("system", `${socket.username} left`);
      io.to(socket.room).emit("user-list", Array.from(rooms[socket.room].values()));
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));