const express = require('express');
const easyDebug = require('easy-debug');

const app = express();
easyDebug.enable({
  format: 'json',
  telemetry: { enabled: true },
  tea: { packageId: 'my-api' },
  ai: { enabled: true },
});
app.use(easyDebug.getPlugin('express').middleware);
app.use(easyDebug.getPlugin('express').errorMiddleware);

app.get('/user/:id', easyDebug.wrap(async (req, res) => {
  if (!req.params.id) throw new Error('Invalid ID');
  res.json({ id: req.params.id });
}, { context: 'User API' }));

app.listen(3000, () => {
  console.log('Server running');
  console.log('Predictions:', easyDebug.predict());
});