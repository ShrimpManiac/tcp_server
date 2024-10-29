import { GAME_STATE, MAX_PLAYERS } from '../../constants/game.js';
import { USER_PING_INTERVAL } from '../../constants/interval.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import {
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../managers/interval.manager.js';

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.intervalManager = new IntervalManager();
    this.state = GAME_STATE.WAITING;
  }

  addPlayer(user) {
    if (this.players.length > MAX_PLAYERS) {
      throw new CustomError(
        ErrorCodes.GAME_FULL,
        `참가자 수가 최대인원에 도달하여 참가할 수 없습니다.`,
      );
    }
    this.players.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), USER_PING_INTERVAL);

    if (this.players.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getPlayer(userId) {
    return this.players.find((user) => user.id === userId);
  }

  removePlayer(userId) {
    this.players = this.players.filter((user) => user.id !== userId);

    this.intervalManager.removePlayer(userId);

    if (this.players.length < MAX_PLAYERS) {
      this.state = GAME_STATE.WAITING;
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.players.forEach((player) => (maxLatency = Math.max(maxLatency, player.latency)));
    return maxLatency;
  }

  startGame() {
    this.state = GAME_STATE.IN_PROGRESS;
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(`maxLatency: ${this.getMaxLatency()}`);

    this.players.forEach((player) => player.socket.write(startPacket));
  }

  getAllLocations() {
    const maxLatency = this.getMaxLatency();
    const locationData = this.players.map((player) => {
      const { x, y } = player.calculatePosition(maxLatency);
      return { id: player.id, x, y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;
