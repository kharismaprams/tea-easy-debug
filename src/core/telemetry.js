class Telemetry {
  constructor(options = {}) {
    this.enabled = !!options.enabled;
    this.data = [];
    this.maxData = options.maxData || 1000;
    this.batchInterval = options.batchInterval || 10000;
    this.batch = [];
    if (this.enabled) {
      this.interval = setInterval(() => this.flushBatch(), this.batchInterval);
    }
  }

  track(event, metadata = {}) {
    if (!this.enabled) return;
    if (typeof event !== 'string' || typeof metadata !== 'object') {
      console.warn('Invalid telemetry data');
      return;
    }
    const entry = { event, metadata, timestamp: new Date().toISOString() };
    this.batch.push(entry);
    if (this.data.length >= this.maxData) this.data.shift();
    this.data.push(entry);
  }

  flushBatch() {
    if (this.batch.length) {
      console.log('Flushing telemetry batch:', this.batch.length);
      this.batch = [];
    }
  }

  disable() {
    if (this.interval) clearInterval(this.interval); // Clear interval on disable
    this.enabled = false;
  }

  getData() {
    return this.data;
  }
}

module.exports = Telemetry;