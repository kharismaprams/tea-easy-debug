const EasyDebug = require('../../src/core/index');

describe('Next.js Plugin', () => {
  test('logs client error', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    EasyDebug.getPlugin('next').clientError(new Error('Client error'));
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});