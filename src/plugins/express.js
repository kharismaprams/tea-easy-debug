module.exports = (easyDebug) => ({
    middleware: (req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        easyDebug.log(`Request ${req.method} ${req.url}`, {
          level: 'info',
          context: { duration, status: res.statusCode },
        });
        easyDebug.telemetry.track('express_request', {
          method: req.method,
          url: req.url,
          duration,
          status: res.statusCode,
        });
      });
      next();
    },
    errorMiddleware: (err, req, res, next) => {
      easyDebug.log(err, { level: 'error', context: { url: req.url } });
      res.status(500).send('Internal Server Error');
      next();
    },
  });