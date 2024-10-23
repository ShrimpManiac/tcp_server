import { config } from '../config/config.js';

export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length < length) break; // 아직 전체 패킷이 도착하지 않음

    const packet = socket.buffer.subarray(totalHeaderLength);
    socket.buffer = socket.buffer.subarray(0, totalHeaderLength);
    console.log(`length: ${length}, packetType: ${packetType}`);
    console.log(`packet: ${packet}`);
  }
};
