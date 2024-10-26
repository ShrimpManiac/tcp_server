/* 새로운 핸들러 추가시 다음 변수들도 업데이트 해주어야 합니다:
- constants\handlerIds.js -> HANDLER_IDS
- handlers\index.js -> handlers
*/

import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession } from '../../session/game.session.js';
import { getuserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const joinGameHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId } = payload;
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = getuserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    const userExists = gameSession.getUser(user.id);
    if (!userExists) {
      gameSession.addUser(user);
    }

    const joinGameResponse = createResponse(HANDLER_IDS.JOIN_GAME, userId, RESPONSE_SUCCESS_CODE, {
      gameId,
      message: '게임에 참가했습니다.',
    });

    socket.write(joinGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default joinGameHandler;
