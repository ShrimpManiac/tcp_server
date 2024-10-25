import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`TCP server listening on port ${config.server.host} : ${config.server.port}`);
      console.log(server.address());
    });
  })
  .catch((error) => {
    console.error('서버 초기화 중 오류가 발생했습니다:', error);
    process.exit(1);
  });
