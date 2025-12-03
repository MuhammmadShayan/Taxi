// File-based token storage for password reset functionality
// This persists across server restarts unlike in-memory storage

import fs from 'fs';
import path from 'path';

class TokenStorage {
  constructor() {
    this.tokensFile = path.join(process.cwd(), '.next', 'reset-tokens.json');
    this.ensureTokensFile();
    
    // Clean expired tokens every hour
    setInterval(() => this.cleanExpiredTokens(), 60 * 60 * 1000);
  }

  // Ensure tokens file exists
  ensureTokensFile() {
    try {
      const dir = path.dirname(this.tokensFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      if (!fs.existsSync(this.tokensFile)) {
        fs.writeFileSync(this.tokensFile, '{}');
      }
    } catch (error) {
      console.error('Error creating tokens file:', error);
    }
  }

  // Read tokens from file
  readTokens() {
    try {
      const data = fs.readFileSync(this.tokensFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading tokens file:', error);
      return {};
    }
  }

  // Write tokens to file
  writeTokens(tokens) {
    try {
      fs.writeFileSync(this.tokensFile, JSON.stringify(tokens, null, 2));
    } catch (error) {
      console.error('Error writing tokens file:', error);
    }
  }

  // Store a reset token with email and expiration
  storeToken(token, email, expirationMinutes = 60) {
    const expiresAt = Date.now() + (expirationMinutes * 60 * 1000);
    const tokens = this.readTokens();
    
    tokens[token] = {
      email,
      expiresAt,
      createdAt: Date.now()
    };
    
    this.writeTokens(tokens);
    console.log(`Token stored for ${email}, expires at: ${new Date(expiresAt)}`);
  }

  // Retrieve and validate a token
  getToken(token) {
    const tokens = this.readTokens();
    const tokenData = tokens[token];
    
    if (!tokenData) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      delete tokens[token];
      this.writeTokens(tokens);
      return null;
    }

    return tokenData;
  }

  // Use (and delete) a token
  useToken(token) {
    const tokens = this.readTokens();
    const tokenData = tokens[token];
    
    if (!tokenData) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      delete tokens[token];
      this.writeTokens(tokens);
      return null;
    }

    // Token is valid, delete it and return data
    delete tokens[token];
    this.writeTokens(tokens);
    return tokenData;
  }

  // Clean expired tokens
  cleanExpiredTokens() {
    const tokens = this.readTokens();
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [token, data] of Object.entries(tokens)) {
      if (now > data.expiresAt) {
        delete tokens[token];
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this.writeTokens(tokens);
      
    }
  }

  // Get statistics (for debugging)
  getStats() {
    const tokens = this.readTokens();
    const allTokens = Object.values(tokens);
    return {
      totalTokens: allTokens.length,
      activeTokens: allTokens.filter(data => Date.now() <= data.expiresAt).length
    };
  }
}

// Create a singleton instance
const tokenStorage = new TokenStorage();

export default tokenStorage;
