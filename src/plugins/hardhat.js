module.exports = (easyDebug) => ({
    debug: (contract, method, error, gasUsed) => {
      const context = { contract, method, gasUsed };
      easyDebug.log(error, { level: 'error', context });
      easyDebug.telemetry.track('hardhat_error', context);
    },
  });