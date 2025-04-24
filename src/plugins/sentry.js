const Sentry = require('@sentry/node');

module.exports = (easyDebug, sentryOptions = {}) => {
  if (sentryOptions.dsn) {
    Sentry.init({ dsn: sentryOptions.dsn });
  }

  return {
    capture: (error) => {
      if (sentryOptions.dsn) {
        Sentry.captureException(error);
        easyDebug.telemetry.track('sentry_capture', { error: error.message });
      }
    },
  };
};