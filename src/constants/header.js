/**
 * 헤더의 길이 부분 크기 (바이트)
 */
export const TOTAL_LENGTH_BYTES = 4; // 수정시 readUInt와 writeUInt 메소드도 수정필요

/**
 * 헤더의 패킷타입 부분 크기 (바이트)
 */
export const PACKET_TYPE_BYTES = 1; // 수정시 readUInt와 writeUInt 메소드도 수정필요

/**
 * 패킷 타입
 */
export const PACKET_TYPE = Object.freeze({
  PING: 0,
  NORMAL: 1,
  // 추가시 해당 enum을 사용하는 switch문에 case 추가 필요
});
