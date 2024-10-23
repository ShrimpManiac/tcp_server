/**
 * 헤더의 길이 부분 크기 (바이트)
 */
export const TOTAL_LENGTH_BYTES = 4;

/**
 * 헤더의 패킷타입 부분 크기 (바이트)
 */
export const PACKET_TYPE_BYTES = 4;

/**
 * 패킷 타입
 */
export const PACKET_TYPE = Object.freeze({
  PING: 0,
  NORMAL: 1,
});
