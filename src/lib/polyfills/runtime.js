const g = globalThis;
try {
  if (typeof g.File === 'undefined') {
    const PolyfillFile = require('./file.js');
    g.File = PolyfillFile;
  }
} catch {}

module.exports = {};

