import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  addInterval(id, callback, interval, type) {
    if (!this.intervals.has(id)) {
      this.intervals.set(id, new Map());
    }
    this.intervals.get(id).set(type, setInterval(callback, interval));
  }

  addPlayer(playerId, callback, interval) {
    this.addInterval(playerId, callback, interval, 'player');
  }

  addGame(gameId, callback, interval) {
    this.addInterval(gameId, callback, interval, 'game');
  }

  addPositionUpdate(playerId, callback, interval) {
    this.addInterval(playerId, callback, interval, 'positionUpdate');
  }

  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(playerId);
    }
  }

  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
