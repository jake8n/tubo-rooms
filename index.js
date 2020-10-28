const io = require("socket.io")({});
// TODO: make persistent
const docs = new Map();
io.on("connection", (socket) => {
  const { room } = socket.handshake.query;
  if (!docs.get(room)) {
    docs.set(room, { js: "", html: "", css: "" });
  }
  socket.join(room);
  ["js", "html", "css"].forEach((value) => {
    socket.emit(`init:${value}`, docs.get(room)[value]);
    socket.on(`update:${value}`, (changes) => {
      console.log("update", value);
      socket.to(room).emit(`update:${value}`, changes);
    });
    socket.on(`sync:${value}`, (doc) => {
      const docPrevious = docs.get(room);
      docPrevious[value] = doc;
      docs.set(room, docPrevious);
    });
  });
});
io.listen(process.env.PORT);
