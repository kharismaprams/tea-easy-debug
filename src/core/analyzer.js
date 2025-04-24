class Analyzer {
  constructor(options = {}) {
    this.errors = [];
    this.aiOptions = options || {};
  }

  recordError(error) {
    this.errors.push({
      id: `err_${this.errors.length + 1}`,
      message: error.message || 'Unknown error',
      context: error.context || {},
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }

  summarize() {
    const errorTypes = {};
    this.errors.forEach((err) => {
      errorTypes[err.message] = (errorTypes[err.message] || 0) + 1;
    });
    return {
      totalErrors: this.errors.length,
      criticalErrors: this.errors.length,
      errorTypes,
      lastError: this.errors[this.errors.length - 1] || null,
    };
  }
}

module.exports = Analyzer;