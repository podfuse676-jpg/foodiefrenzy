// network-test.js
// Test different network binding configurations

import express from 'express';
import { networkInterfaces } from 'os';

// Get port from environment or default to 10000
const PORT = process.env.PORT || process.env.RAILWAY_PORT || 10000;

console.log('=== NETWORK INTERFACES ===');
const nets = networkInterfaces();
for (const [name, interfaces] of Object.entries(nets)) {
  console.log(`Interface ${name}:`);
  interfaces.forEach(iface => {
    console.log(`  ${iface.address} (${iface.family})`);
  });
}

console.log('\n=== TESTING DIFFERENT BINDINGS ===');

// Test 1: Bind to all interfaces (0.0.0.0)
const app1 = express();
app1.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', binding: '0.0.0.0' });
});

const server1 = app1.listen(PORT, '0.0.0.0', () => {
  console.log(`Server 1 listening on 0.0.0.0:${PORT}`);
});

// Test 2: Bind to localhost
setTimeout(() => {
  const app2 = express();
  app2.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', binding: 'localhost' });
  });

  const server2 = app2.listen(PORT + 1, 'localhost', () => {
    console.log(`Server 2 listening on localhost:${PORT + 1}`);
  });

  // Test 3: Bind to specific interface
  setTimeout(() => {
    const app3 = express();
    app3.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', binding: '127.0.0.1' });
    });

    const server3 = app3.listen(PORT + 2, '127.0.0.1', () => {
      console.log(`Server 3 listening on 127.0.0.1:${PORT + 2}`);
    });

    // Keep servers running for a bit
    setTimeout(() => {
      console.log('All servers started, shutting down...');
      server1.close();
      server2.close();
      server3.close();
    }, 5000);
  }, 1000);
}, 1000);