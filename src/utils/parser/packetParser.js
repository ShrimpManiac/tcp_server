import { config } from '../../config/config.js';
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

  // 검증: 클라이언트 버전 일치
  if (clientVersion !== config.clientVersion) {
    console.error(`클라이언트 버전이 일치하지 않습니다`);
  }

  // Payload 파싱
  const protoTypeName = getProtoTypeNameByHanderId(handlerId);
  if (!protoTypeName) {
    console.error(`알 수 없는 핸들러ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const payloadType = protoMessages[namespace][typeName];

  let payload;
  try {
    payload = payloadType.decode(packet.payload);
  } catch (error) {
    console.error('Payload를 디코딩하는데 실패했습니다', error);
  }

  // 검증: 패킷 구조 일치
  const errorMessage = payloadType.verify(payload);
  if (errorMessage) {
    console.error(`패킷 구조가 일치하지 않습니다: ${errorMessage}`);
  }

  // 검증: 누락된 필드 존재여부
  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields.length > 0) {
    console.error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
  }

  return { handlerId, userId, payload, sequence };
};
