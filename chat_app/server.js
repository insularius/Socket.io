const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://local.daru.kz:3000",
      "https://socket-io-nu-seven.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });
  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    socket.to(data.roomId).emit("receive_msg", data);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || "https://socket-io-nu-seven.vercel.app";
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
