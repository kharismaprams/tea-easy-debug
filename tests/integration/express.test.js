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
});