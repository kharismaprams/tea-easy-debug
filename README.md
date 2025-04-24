# easy-debug
The ultimate error handling and debugging library for Node.js, frontend, smart contracts, and tea Protocol.

## Overview
`easy-debug` simplifies error handling, debugging, and telemetry across all development stacks. It features local AI-driven error prediction, tea Protocol integration for bug reporting and teaRank boosting, and plugins for popular frameworks. Output is optimized for AI analysis (Grok, ChatGPT, Claude) via JSON/CSV files.

## Features
- **Error Wrapping**: Contextual error handling with stack traces.
- **Custom Logging**: Log to console/file with rate limiting (JSON/text).
- **AI Error Prediction**: Local TinyML-based prediction, with JSON/CSV output for Grok, ChatGPT, Claude.
- **Error Replay**: Simulate errors for debugging.
- **Telemetry**: Track usage with batch reporting.
- **tea Protocol**: Report bugs/usage to blockchain, boost teaRank.
- **Plugins**: Express, Hardhat, Next.js, Sentry.
- **CLI Dashboard**: Interactive error analysis (`easy-debug analyze`).
- **Security**: Input sanitization, ECDSA signatures.

## Installation
```bash
npm install easy-debug @sentry/node commander
```

## Usage
### Basic Error Handling
```javascript
const easyDebug = require('easy-debug');

easyDebug.enable({
  verbose: true,
  format: 'json',
  telemetry: { enabled: true },
  tea: { packageId: 'my-app' },
  ai: { enabled: true },
});

const myFunc = easyDebug.wrap(async () => {
  throw new Error('Invalid ID');
}, { context: 'User API' });

myFunc().catch(err => easyDebug.log(err, { level: 'error' }));

console.log(easyDebug.analyze());
console.log(easyDebug.predict());
```

### CLI Dashboard
```bash
easy-debug analyze
# Output: Error summary and AI predictions
```

### Express Integration
```javascript
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

app.listen(3000);
```

## Example Outputs
### Logging (JSON)
```json
{
  "timestamp": "2025-04-22T14:30:00.123Z",
  "level": "error",
  "message": "Invalid ID",
  "context": {
    "url": "/user/",
    "file": "server.js:45:12",
    "timestamp": "2025-04-22T14:30:00.123Z"
  },
  "stack": "Error: Invalid ID\n    at server.js:45:12\n    at ..."
}
```

### AI Prediction (JSON)
```json
[
  {
    "error_id": "err_001",
    "error_message": "Invalid ID",
    "likelihood": 0.25,
    "frequency": 25,
    "timestamp": "2025-04-22T14:30:00.123Z",
    "context": {
      "url": "/user/",
      "file": "server.js:45:12",
      "module": "Express API",
      "env": "production"
    },
    "stack_summary": "server.js:45:12 -> api.js:20:5",
    "ai_suggestions": [
      {
        "provider": "Grok",
        "suggestion": "Add input validation: if (!id) throw new Error('Missing ID')",
        "confidence": 0.85
      },
      {
        "provider": "ChatGPT",
        "suggestion": "Implement middleware to check ID format",
        "confidence": 0.80
      },
      {
        "provider": "Claude",
        "suggestion": "Use Joi for schema validation in server.js:45",
        "confidence": 0.90
      }
    ],
    "tea_signature": "a1b2c3d4e5f6..."
  }
]
```

### AI Prediction (CSV)
```
error_id,error_message,likelihood,frequency,timestamp,context_url,context_file,context_module,context_env,stack_summary,ai_provider_1,ai_suggestion_1,ai_confidence_1,ai_provider_2,ai_suggestion_2,ai_confidence_2,ai_provider_3,ai_suggestion_3,ai_confidence_3,tea_signature
err_001,"Invalid ID",0.25,25,"2025-04-22T14:30:00.123Z","/user/","server.js:45:12","Express API","production","server.js:45:12 -> api.js:20:5","Grok","Add input validation: if (!id) throw new Error('Missing ID')",0.85,"ChatGPT","Implement middleware to check ID format",0.80,"Claude","Use Joi for schema validation in server.js:45",0.90,"a1b2c3d4e5f6..."
```

### Telemetry
```json
[
  {
    "event": "function_error",
    "metadata": {
      "context": "User API",
      "error": "Invalid ID"
    },
    "timestamp": "2025-04-22T14:30:00.123Z"
  }
]
```

### teaRank
```json
{
  "packageId": "my-app",
  "teaRank": 0.85,
  "metadata": {
    "version": "1.0.0"
  }
}
```

## Use Cases
1. **Backend (Express)**: Log requests, predict errors, report bugs to tea Protocol.
2. **Smart Contract (Hardhat)**: Debug transaction failures, optimize gas usage.
3. **Frontend (Next.js)**: Handle client-side errors, track telemetry.
4. **tea Protocol**: Boost teaRank, report bugs securely.

## Example Use Cases
### Express API
**Scenario**: API fails due to invalid user ID.
**Code**: See `examples/express/index.js`.
**Output**: AI prediction suggests input validation.
**Run**: `node examples/express/index.js`

### Hardhat Smart Contract
**Scenario**: Contract deployment fails due to gas limit.
**Code**: See `examples/hardhat/deploy.js`.
**Output**: AI prediction suggests gas optimization.
**Run**: `node examples/hardhat/deploy.js`

### Next.js Frontend
**Scenario**: Fetch error on homepage.
**Code**: See `examples/nextjs/pages/index.js`.
**Output**: AI prediction suggests try-catch.
**Run**: `cd examples/nextjs && npm run dev`

## License
MIT (see `LICENSE`).