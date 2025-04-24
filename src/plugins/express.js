module.exports = function (easyDebug) {
  return {
    middleware: (req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        easyDebug.log(`Request ${req.method} ${req.originalUrl}`, {
          level: 'info',
          context: {
            duration,
            status: res.statusCode,
          },
        });
      });
      next();
    },
    errorMiddleware: (err, req, res, next) => {
      if (res.headersSent) return next(err); // Safeguard for already-sent headers
      easyDebug.log(err.message || 'Unknown error', {
        level: 'error',
        context: {
          url: req.originalUrl,
          method: req.method,
          status: res.statusCode || 500,
        },
        stack: err.stack,
      });
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    },
  };
};