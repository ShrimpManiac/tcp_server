import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByDeviceId, updateUserLogin } from '../../db/user/user.db.js';
import { addUser } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId } = payload;

    let user = await findUserByDeviceId(deviceId);

    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    addUser(socket, deviceId);

    const initialResponse = createResponse(HANDLER_IDS.INITIAL, deviceId, RESPONSE_SUCCESS_CODE, {
      userId: user.id,
    });

    // 뭔가 처리가 끝났을 때 보내는 것
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
