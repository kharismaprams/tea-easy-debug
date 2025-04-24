const express = require('express');
const easyDebug = require('easy-debug');

const app = express();


easyDebug.enable({
  verbose: true,
  format: 'json',
  telemetry: { enabled: true },
  tea: { packageId: 'debug-demo' },
  ai: { enabled: true },
  sentry: { dsn: process.env.SENTRY_DSN },
});


app.use(easyDebug.getPlugin('express').middleware);
app.use(easyDebug.getPlugin('express').errorMiddleware);


app.get('/user/:id', easyDebug.wrap(async (req, res) => {
  if (!req.params.id) throw new Error('Invalid ID');
  res.json({ id: req.params.id });
}, { context: 'User API' }));


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  // Cetak analisis dan prediksi
  console.log('Error Summary:', easyDebug.analyze());
  console.log('AI Predictions:', easyDebug.predict());
});