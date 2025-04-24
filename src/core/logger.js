const Sanitize = require('../utils/sanitize');

class Logger {
  constructor(options = {}) {
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.level = options.level || 'info';
    this.format = options.format || 'json';
    this.output = options.output || console;
    this.rateLimit = options.rateLimit || { max: 100, perSecond: 1 };
    this.messages = new Map();
  }

  setLevel(level) {
    if (this.levels[level]) this.level = level;
  }

  log(message, { level = 'info', context = {}, format } = {}) {
    if (this.levels[level] < this.levels[this.level]) return;
    const key = `${level}:${message}`;
    const now = Date.now();
    const entry = this.messages.get(key) || { count: 0, last: 0 };
    if (entry.count >= this.rateLimit.max && now - entry.last < this.rateLimit.perSecond * 1000) return;
    entry.count++;
    entry.last = now;
    this.messages.set(key, entry);

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message: Sanitize(message instanceof Error ? message.message : message),
      context: Sanitize(context),
      stack: message.stack || null,
    };
    const output = format || this.format === 'json' ? JSON.stringify(logEntry, null, 2) : `${timestamp} [${level.toUpperCase()}] ${logEntry.message}`;
    this.output[level === 'error' ? 'error' : 'log'](output);
  }
}

module.exports = Logger;