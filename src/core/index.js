const { AsyncLocalStorage } = require('async_hooks');
const Logger = require('./logger');
const Analyzer = require('./analyzer');
const Tracer = require('./tracer');
const Telemetry = require('./telemetry');
const Replay = require('./replay');
const TeaProtocol = require('../tea/tea');
const Predictor = require('../ai/predictor');
const Cache = require('../utils/cache');
const Sanitize = require('../utils/sanitize');

class EasyDebug {
  constructor(options = {}) {
    this.asyncStorage = new AsyncLocalStorage();
    this.logger = new Logger(options);
    this.analyzer = new Analyzer(options.ai);
    this.tracer = new Tracer();
    this.telemetry = new Telemetry(options.telemetry);
    this.replay = new Replay();
    this.tea = new TeaProtocol(options.tea || {});
    this.predictor = new Predictor(options.ai);
    this.cache = new Cache(options.cache);
    this.debugMode = options.debugMode || false;
    this.plugins = {};
    this.pluginLoaders = {
      express: () => require('../plugins/express')(this),
      hardhat: () => require('../plugins/hardhat')(this),
      next: () => require('../plugins/next')(this),
      sentry: () => require('../plugins/sentry')(this, options.sentry),
    };
  }

  wrap(func, options = {}) {
    return (...args) => {
      const context = { ...options, timestamp: new Date().toISOString() };
      return this.asyncStorage.run(context, async () => {
        try {
          const result = await func(...args);
          this.telemetry.record('function_call', { context });
          if (this.tea.enabled) {
            await this.tea.reportUsage({ context });
          }
          return result;
        } catch (err) {
          err.context = { ...context, url: args[0]?.originalUrl || '' };
          this.logger.log(err.message || 'Unknown error', {
            level: 'error',
            context: err.context,
            stack: err.stack,
          });
          this.analyzer.recordError(err);
          this.replay.save(err);
          if (this.tea.enabled) {
            await this.tea.reportBug(err, err.context);
          }
          throw err;
        }
      });
    };
  }

  enable(options) {
    this.debugMode = true;
    this.logger = new Logger(options);
    this.analyzer = new Analyzer(options.ai);
    this.tracer = new Tracer();
    this.telemetry = new Telemetry(options.telemetry);
    this.replay = new Replay();
    this.tea = new TeaProtocol(options.tea || {});
    this.predictor = new Predictor(options.ai);
    this.cache = new Cache(options.cache);
  }

  log(message, options = {}) {
    this.logger.log(message, options);
  }

  analyze() {
    return this.analyzer.summarize();
  }

  predict() {
    return this.predictor.predict();
  }

  exportTelemetry() {
    return this.telemetry.export();
  }

  getPlugin(name) {
    if (!this.plugins[name]) {
      this.plugins[name] = this.pluginLoaders[name]();
    }
    return this.plugins[name];
  }
}

module.exports = new EasyDebug();