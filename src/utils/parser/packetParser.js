import { getProtoTypeNameByHanderId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조를 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    packet = Packet.decode(data);
  } catch (error) {
    console.error('공통 패킷 구조를 디코딩하던 중 오류가 발생했습니다:', error);
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.clientVersion;
  const sequence = packet.sequence;

  console.log(`clientVersion: ${clientVersion}`);

  const protoTypeName = getProtoTypeNameByHanderId(handlerId);
  if (!protoTypeName) {
    console.error(`알 수 없는 핸들러ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    payload = PayloadType.decode(packet.payload);
  } catch (error) {
    console.error(error);
  }

  return { handlerId, userId, payload, sequence };
};
