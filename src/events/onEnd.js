export const onEnd = (socket) => () => {
  console.log(`Client disconnected: ${socket.remoteAddress} : ${socket.remotePort}`);
};
