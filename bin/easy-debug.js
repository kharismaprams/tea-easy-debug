#!/usr/bin/env node
const { program } = require('commander');
const EasyDebug = require('../src/core/index');

program
  .command('analyze')
  .description('Analyze errors and predictions')
  .action(() => {
    console.log('Error Summary:', EasyDebug.analyze());
    console.log('Predictions:', EasyDebug.predict());
  });

program
  .command('report')
  .description('Report bug to tea registry')
  .argument('<errorId>', 'Error ID to report')
  .action((errorId) => {
    const error = EasyDebug.replay(errorId);
    if (error) {
      EasyDebug.tea.reportBug(error, error.context);
    } else {
      console.error('Error not found');
    }
  });

program.parse();