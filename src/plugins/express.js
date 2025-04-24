module.exports = function (easyDebug) {
  return {
    middleware: (req, res, next) => {
      easyDebug.log(`Request ${req.method} ${req.originalUrl}`, {
        level: 'info',
        context: {
          duration: 0,
          status: res.statusCode,
        },
      });
      next();
    },
    errorMiddleware: (err, req, res, next) => {
      easyDebug.log(err.message || 'Unknown error', {
        level: 'error',
        context: {
          url: req.originalUrl,
          context: err.context?.context || 'Unknown',
        },
        stack: err.stack,
      });
      easyDebug.analyzer.recordError(err); // Tambah ini
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    },
  };
};