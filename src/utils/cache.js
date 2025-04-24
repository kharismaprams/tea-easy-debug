class LRUCache {
    constructor(options = {}) {
      this.max = options.max || 1000;
      this.cache = new Map();
    }
  
    set(key, value) {
      if (this.cache.size >= this.max) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(key, value);
    }
  
    get(key) {
      const value = this.cache.get(key);
      if (value) {
        this.cache.delete(key);
        this.cache.set(key, value);
      }
      return value;
    }
  }
  
  module.exports = LRUCache;