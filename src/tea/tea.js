const crypto = require('crypto');

class TeaProtocol {
  constructor(options = {}) {
    this.registryUrl = options.registryUrl || 'https://tea-protocol-api.example.com';
    this.packageId = options.packageId || 'tea-easy-debug';
    this.enabled = options.enabled !== false;
    try {
      const { privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1',
      });
      this.privateKey = privateKey;
    } catch (err) {
      console.error('Failed to generate private key:', err.message);
      this.privateKey = null;
    }
  }

  async reportUsage(context) {
    if (!this.enabled) return;
    const signature = this.signData(context);
    console.log(`Reporting usage to tea registry: ${this.packageId}`, { context, signature });
  }

  async reportBug(error, context) {
    if (!this.enabled) return;
    const signature = this.signData({ error: error.message, context });
    console.log(`Reporting bug to tea registry: ${error.message}`, { context, signature });
  }

  async getTeaRank() {
    return { packageId: this.packageId, teaRank: 0.85, metadata: { version: '1.0.0' } };
  }

  signData(data) {
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(data));
    sign.end();
    return sign.sign(this.privateKey, 'hex');
  }
}

module.exports = TeaProtocol;