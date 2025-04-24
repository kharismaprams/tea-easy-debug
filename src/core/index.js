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
    this.tea = new TeaProtocol(options.tea);
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

  getPlugin(name) {
    if (!this.plugins[name]) {
      this.plugins[name] = this.pluginLoaders[name]();
    }
    return this.plugins[name];
  }

  wrap(func, context = {}) {
    return this.asyncStorage.run({ context: Sanitize(context) }, () => async (...args) => {
      try {
        const result = await func(...args);
        this.telemetry.track('function_success', { context });
        this.tea.reportUsage(context);
        return result;
      } catch (error) {
        const enhancedError = this.tracer.enhance(error, context);
        this.logger.log(enhancedError, { level: 'error', context });
        this.analyzer.record(enhancedError);
        this.replay.store(enhancedError);
        this.telemetry.track('function_error', { context, error: enhancedError.message });
        this.getPlugin('sentry').capture(enhancedError);
        this.tea.reportBug(enhancedError, context);
        throw enhancedError;
      }
    });
  }

  enable(options = {}) {
    this.debugMode = true;
    this.logger.setLevel(options.verbose ? 'debug' : 'info');
  }

  disable() {
    this.debugMode = false;
    this.logger.setLevel('error');
  }

  log(message, options = {}) {
    if (this.debugMode || options.level === 'error') {
      const sanitized = Sanitize(message);
      this.logger.log(sanitized, options);
    }
  }

  analyze() {
    return this.analyzer.summary();
  }

  predict() {
    return this.predictor.predict(this.analyzer.errors);
  }

  replay(errorId) {
    return this.replay.replay(errorId);
  }

  exportTelemetry() {
    return this.telemetry.getData();
  }

  async getTeaRank() {
    return this.tea.getTeaRank();
  }
}

module.exports = new EasyDebug();