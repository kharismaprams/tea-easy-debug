const Cache = require('../utils/cache');

class Analyzer {
  constructor(options = {}) {
    this.errors = [];
    this.maxErrors = options.maxErrors || 1000;
    this.aiEnabled = !!options.enabled;
    this.cache = new Cache({ max: 1000 });
  }

  record(error) {
    if (this.errors.length >= this.maxErrors) this.errors.shift();
    const errorId = `err_${this.errors.length.toString().padStart(3, '0')}`;
    const enhanced = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: error.context || { level: 'error' }, // Default context level
    };
    this.errors.push(enhanced);
    this.cache.set(errorId, enhanced);
  }

  summary() {
    const total = this.errors.length;
    const byType = this.errors.reduce((acc, err) => {
      acc[err.message] = (acc[err.message] || 0) + 1;
      return acc;
    }, {});
    const critical = this.errors.filter(err => err.context.level === 'error').length;
    return {
      totalErrors: total,
      criticalErrors: critical,
      errorTypes: byType,
      lastError: this.errors[total - 1] || null,
    };
  }
}

module.exports = Analyzer;