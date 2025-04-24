const request = require('supertest');
const express = require('express');
const EasyDebug = require('../../src/core/index');

describe('Express Plugin', () => {
  const app = express();
  app.use(EasyDebug.getPlugin('express').middleware);
  app.get('/', (req, res) => res.send('OK'));

  test('logs request', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await request(app).get('/');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('handles errors gracefully', async () => {
    const app = express();
    app.use(EasyDebug.getPlugin('express').middleware);
    app.get('/error', (req, res) => {
      throw new Error('Test error');
    });
    app.use(EasyDebug.getPlugin('express').errorMiddleware);

    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Test error' }); // Fixed assertion
  });
});