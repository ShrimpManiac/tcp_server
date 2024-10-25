import net from 'net';
import { config } from './src/config/config.js';
import { getProtoMessages, loadProtos } from './src/init/loadProtos.js';

let userId;
let sequence;

const createPacket = (handlerId, payload, clientVersion = '1.0.0', type, name) => {
  const protoMessages = getProtoMessages();
  const PayloadType = protoMessages[type][name];

  if (!PayloadType) {
    throw new Error('PayloadType을 찾을 수 없습니다.');
  }

  const payloadMessage = PayloadType.create(payload);
  const payloadBuffer = PayloadType.encode(payloadMessage).finish();

  return {
    handlerId,
    userId: '1',
    clientVersion,
    sequence: 0,
    payload: payloadBuffer,
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
  console.log('Connected to server.');
  await loadProtos();

  const successPacket = createPacket(0, { deviceId: 'xxxxx' }, '1.0.0', 'initial', 'InitialPacket');

  sendPacket(client, successPacket);
});

client.on('data', (data) => {
  // 1. 길이 정보 수신 (4바이트)
  const length = data.readUInt32BE(0);
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  // 2. 패킷 타입 정보 수신 (1바이트)
  const packetType = data.readUInt8(4);
  const packet = data.slice(totalHeaderLength, length); // 패킷 데이터

  if (packetType === 1) {
    const protoMessages = getProtoMessages();
    const Response = protoMessages.response.Response;

    try {
      const response = Response.decode(packet);

      if (response.handlerId === 0) {
        const responseData = JSON.parse(Buffer.from(response.data).toString());

        userId = responseData.userId;
        console.log('응답 데이터:', responseData);
      }
      sequence = response.sequence;
    } catch (error) {
      console.log(error);
    }
  }
});

client.on('close', () => {
  console.log('Connection closed.');
});

client.on('error', (error) => {
  console.error('Client error:', error);
});
