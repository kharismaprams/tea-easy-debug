const EasyDebug = require('../../src/core/index');

describe('tea-easy-debug', () => {
  test('wraps function and catches error', async () => {
    const func = EasyDebug.wrap(() => { throw new Error('Test error'); }, { context: 'Test' });
    await expect(func()).rejects.toThrow('Test error');
  });

  test('logs error in debug mode', () => {
    EasyDebug.enable({ verbose: true });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    EasyDebug.log('Test message', { level: 'info' });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('analyzes errors', () => {
    EasyDebug.wrap(() => { throw new Error('Test error'); }, { context: 'Test' })();
    const summary = EasyDebug.analyze();
    expect(summary.totalErrors).toBe(1);
    expect(summary.errorTypes['Test error']).toBe(1);
  });
});