class PolyfillFile {
  constructor(bits = [], name = '', options = {}) {
    this.name = String(name || 'file');
    this.type = String(options.type || '');
    this.lastModified = Number(options.lastModified || Date.now());
    this.size = Array.isArray(bits)
      ? bits.reduce((sum, b) => sum + (b?.size || b?.length || 0), 0)
      : 0;
  }
}

module.exports = PolyfillFile;

