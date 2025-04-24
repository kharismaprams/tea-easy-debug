#!/usr/bin/env node
const { program } = require('commander');
const EasyDebug = require('../src/core/index'); // Fixed import path

program
  .command('analyze')
  .description('Analyze errors and predictions')
  .action(() => {
    try {
      console.log('Error Summary:', EasyDebug.analyze());
      console.log('AI Predictions:', EasyDebug.predict());
    } catch (err) {
      console.error('Failed to analyze:', err.message);
    }
  });

program
  .command('report')
  .description('Report bug to tea registry')
  .argument('<errorId>', 'Error ID to report')
  .action((errorId) => {
    try {
      const error = EasyDebug.replay.find(errorId);
      if (error) {
        EasyDebug.tea.reportBug(error, error.context);
      } else {
        console.error('Error not found');
      }
    } catch (err) {
      console.error('Failed to report bug:', err.message);
    }
  });

program.parse();