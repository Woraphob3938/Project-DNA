import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
const bad = {};
page.on('response', (r) => {
  if (r.status() >= 400) {
    const u = r.url();
    if (bad[u]) bad[u]++;
    else bad[u] = 1;
  }
});

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const urls = Object.keys(bad);
console.log('4xx responses:');
urls.forEach((u) => console.log('  ' + bad[u] + 'x ' + u));
if (urls.length === 0) console.log('  (none)');
await browser.close();
