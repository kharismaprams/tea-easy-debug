module.exports = function sanitize(input) {
    if (typeof input === 'string') {
      return input.replace(/[<>]/g, '');
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized = Array.isArray(input) ? [] : {};
      for (const key in input) {
        sanitized[key] = sanitize(input[key]);
      }
      return sanitized;
    }
    return input;
  };