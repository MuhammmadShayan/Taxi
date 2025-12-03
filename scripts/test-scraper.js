const assert = require('assert');

async function run() {
  console.log('Testing checkTargetReachability...');
  const mod = await import('../src/lib/vehicles-scraper.js');
  const reach = await mod.checkTargetReachability('https://www.cars.com');
  assert.ok(reach && reach.url && reach.method, 'reachability should return details');
  console.log('Reachability result:', reach);
  console.log('OK');
}

run().catch((e) => {
  console.error('Tests failed:', e);
  process.exit(1);
});
