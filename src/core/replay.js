class Replay {
    constructor() {
      this.replays = new Map();
    }
  
    store(error) {
      this.replays.set(error.id, error);
    }
  
    replay(errorId) {
      const error = this.replays.get(errorId);
      if (!error) return null;
      const simulated = new Error(error.message);
      simulated.stack = error.stack;
      simulated.context = error.context;
      return simulated;
    }
  }
  
  module.exports = Replay;