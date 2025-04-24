const EasyDebug = require('../../src/core/index');

describe('Hardhat Plugin', () => {
  test('logs smart contract error', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    EasyDebug.getPlugin('hardhat').debug('MyContract', 'transfer', new Error('Failed'), 21000);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});