import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(socket, id) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
    this.latency = 0;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.lastUpdateTime) / 2;
    console.log(`Received pong from ${this.id} at ${now} with ${this.latency}ms`);
  }
}

export default User;
