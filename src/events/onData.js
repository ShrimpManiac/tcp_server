import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { getuserById } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { handleError } from '../utils/error/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    // 아직 전체 패킷이 도착하지 않음
    if (socket.buffer.length < length) {
      break;
    }

    const packet = socket.buffer.subarray(totalHeaderLength);
    socket.buffer = socket.buffer.subarray(0, totalHeaderLength);
    console.log(`length: ${length}, packetType: ${packetType}`);
    console.log(`packet: ${packet}`);

    try {
      switch (packetType) {
        case PACKET_TYPE.PING: {
          break;
        }
        case PACKET_TYPE.NORMAL: {
          const { handlerId, userId, payload, sequence } = packetParser(packet);

          // 검증: 시퀀스 일치
          const user = getuserById(userId);
          if (user && user.sequence !== sequence) {
            throw new CustomError(ErrorCodes.INVALID_SEQUENCE, `잘못된 호출값입니다.`);
          }

          const handler = getHandlerById(handlerId);
          await handler({ socket, userId, payload });

          break;
        }
      }
    } catch (error) {
      handleError(socket, error);
    }
  }
};
