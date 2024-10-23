import net from 'net';
import { config } from './src/config/config.js';
import { getProtoMessages, loadProtos } from './src/init/loadProtos.js';

const readHeader = (buffer) => {
  return {
    length: buffer.readUInt32BE(0),
    packetType: buffer.writeUInt8(config.packet.totalLength),
  };
};

const sendPacket = (socket, packet) => {
  const protoMessages = getProtoMessages();
  const Packet = protoMessages.common.Packet;
  if (!Packet) {
    console.error('Packet 메시지를 찾을 수 없습니다.');
    return;
  }

  const buffer = Packet.encode(packet).finish();

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  ); // 패킷 길이에 타입 바이트 포함

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(1, 0); // NORMAL TYPE

  // 길이 정보와 메시지를 함께 전송
  const packetWithLength = Buffer.concat([packetLength, packetType, buffer]);

  socket.write(packetWithLength);
};

const client = new net.Socket();

client.connect(config.server.port, config.server.host, async () => {
  console.log('Connected to server');
  await loadProtos();

  const message = {
    handlerId: 2,
    userId: 'xyz',
    payload: {},
    clientVersion: '1.0.0',
    sequence: 0,
  };

  sendPacket(client, message);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  const { handlerId, length } = readHeader(buffer);
  console.log(`handlerId: ${handlerId}`);
  console.log(`length: ${length}`);

  const headerSize = config.packet.totalLength + config.packet.typeLength;
  // 메시지 추출
  const message = buffer.subarray(headerSize); // 앞의 헤더 부분을 잘라낸다.

  console.log(`서버로부터 받은 메세지: ${message}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (error) => {
  console.error('Client error:', error);
});
