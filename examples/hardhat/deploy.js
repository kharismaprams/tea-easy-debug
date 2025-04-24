const { ethers } = require('hardhat');
const easyDebug = require('tea-easy-debug');

easyDebug.enable({
  tea: { packageId: 'my-contract' },
  ai: { enabled: true },
});

async function deploy() {
  try {
    const Contract = await ethers.getContractFactory('MyContract');
    await Contract.deploy();
  } catch (error) {
    easyDebug.getPlugin('hardhat').debug('MyContract', 'deploy', error, 21000);
    console.log('Predictions:', easyDebug.predict());
  }
}
deploy();