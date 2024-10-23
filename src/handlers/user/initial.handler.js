import { addUser } from '../../session/user.session.js';

const initialHandler = async ({ socket, userId, payload }) => {
  const { deviceId } = payload;

  addUser(socket, deviceId);

  // 뭔가 처리가 끝났을 때 보내는 것
  socket.write('');
};

export default initialHandler;
