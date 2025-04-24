module.exports = (easyDebug) => ({
    middleware: (req, res, next) => {
      easyDebug.log(`Next.js request ${req.url}`, {
        level: 'info',
        context: { page: req.url },
      });
      next();
    },
    clientError: (error) => {
      easyDebug.log(error, { level: 'error', context: { client: true } });
    },
  });