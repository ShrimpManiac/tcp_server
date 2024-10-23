import net from 'net';
import { config } from './src/config/config.js';

const readHeader = (buffer) => {
  return {
    length: buffer.readUInt32BE(0),
    packetType: buffer.writeUInt8(config.packet.totalLength),
  };
};

const writeHeader = (length, packetType) => {
  const headerSize = config.packet.totalLength + config.packet.typeLength;
  const buffer = Buffer.alloc(headerSize);
  buffer.writeUInt32BE(length + headerSize, 0);
  buffer.writeUInt8(packetType, config.packet.totalLength);
  return buffer;
};

const client = new net.Socket();

client.connect(config.server.port, config.server.host, () => {
  console.log('Connected to server');

  const message = 'Hi there!';
  const test = Buffer.from(message);

  const header = writeHeader(test.length, 11);
  const packet = Buffer.concat([header, test]);
  client.write(packet);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  const { handlerId, length } = readHeader(buffer);
  console.log(`handlerId: ${handlerId}`);
  console.log(`length: ${length}`);

  const headerSize = config.packet.totalLength + config.packet.typeLength;
  // 메시지 추출
  const message = buffer.subarray(headerSize); // 앞의 헤더 부분을 잘라낸다.

  console.log(`Message received from server: ${message}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
