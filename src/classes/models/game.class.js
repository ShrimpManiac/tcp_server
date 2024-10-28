import { GAME_STATE, MAX_PLAYERS } from '../../constants/game.js';
import { USER_PING_INTERVAL } from '../../constants/interval.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import IntervalManager from '../managers/interval.manager.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = GAME_STATE.WAITING;
  }

  addUser(user) {
    if (this.users.length > MAX_PLAYERS) {
      throw new CustomError(
        ErrorCodes.GAME_FULL,
        `참가자 수가 최대인원에 도달하여 참가할 수 없습니다.`,
      );
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), USER_PING_INTERVAL);

    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);

    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = GAME_STATE.WAITING;
    }
  }

  startGame() {
    this.state = GAME_STATE.IN_PROGRESS;
  }
}

export default Game;
