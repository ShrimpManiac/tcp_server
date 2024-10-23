import { removeUser } from '../session/user.session.js';

export const onEnd = (socket) => () => {
  console.log(`클라이언트 연결이 종료되었습니다: ${socket.remoteAddress} : ${socket.remotePort}`);

  // 세션에서 유저 삭제
  removeUser(socket);
};
