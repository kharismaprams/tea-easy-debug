class Tracer {
    enhance(error, context = {}) {
      const enhanced = new Error(error.message);
      enhanced.stack = error.stack;
      enhanced.context = {
        ...context,
        file: this.getFileInfo(error.stack),
        timestamp: new Date().toISOString(),
      };
      return enhanced;
    }
  
    getFileInfo(stack) {
      const lines = stack.split('\n');
      const callerLine = lines[1] || '';
      const match = callerLine.match(/\((.*):(\d+):(\d+)\)/) || callerLine.match(/at (.*):(\d+):(\d+)/);
      return match ? { file: match[1], line: match[2], column: match[3] } : null;
    }
  }
  
  module.exports = Tracer;