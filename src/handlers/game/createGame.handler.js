/* 새로운 핸들러 추가시 다음 변수들도 업데이트 해주어야 합니다:
- constants\handlerIds.js -> HANDLER_IDS
- handlers\index.js -> handlers
*/

import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getuserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';

const createGameHandler = ({ socket, userId, payload }) => {
  try {
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);

    const user = getuserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    gameSession.addUser(user);

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      userId,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다.' },
    );

    socket.write(createGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default createGameHandler;
