let ioInstance = null;
const userSocketMap = new Map();

function initIO(server, corsOptions = {}) {
  if (ioInstance) return ioInstance;
  const socketIo = require("socket.io");
  ioInstance = socketIo(server, { cors: corsOptions });
  ioInstance.on("connection", (socket) => {
    // Step 1: Register user_id
    socket.on("register_user", ({ user_id }) => {
      if (user_id) {
        userSocketMap.set(user_id, socket.id);
        console.log(`Mapped user_id ${user_id} to socket ${socket.id}`);
      }
    });

    // Optional: Cleanup on disconnect
    socket.on("disconnect", () => {
      for (const [user_id, sid] of userSocketMap.entries()) {
        if (sid === socket.id) {
          userSocketMap.delete(user_id);
          // console.log(`Removed user_id ${user_id} on disconnect`);
          break;
        }
      }
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized. Call initIO(server) first.");
  }
  return ioInstance;
}

function getSocketIdFromUserId(user_id) {
 console.log(userSocketMap)
  return userSocketMap.get(user_id);
}

module.exports = {
  initIO,
  getIO,
  getSocketIdFromUserId,
};
