const io = require("socket.io")({
  origins: "*:*",
});

io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);

    if (io.sockets.adapter.rooms[room].length <= 1) {
      socket.emit("room-created");
    } else {
      socket.to(room).emit("request-for-state");
    }

    // TODO: reply directly to whomever made request
    socket.on("response-for-state", (value) =>
      socket.to(room).emit("room-joined", value)
    );

    socket.on("transaction", (transaction) =>
      socket.to(room).emit("transaction", transaction)
    );
  });
});

io.listen(process.env.PORT || 80);
