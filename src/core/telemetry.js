class Telemetry {
    constructor(options = {}) {
      this.enabled = !!options.enabled;
      this.data = [];
      this.maxData = options.maxData || 1000;
      this.batchInterval = options.batchInterval || 10000;
      this.batch = [];
      if (this.enabled) {
        setInterval(() => this.flushBatch(), this.batchInterval);
      }
    }
  
    track(event, metadata = {}) {
      if (!this.enabled) return;
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
  
    getData() {
      return this.data;
    }
  }
  
  module.exports = Telemetry;