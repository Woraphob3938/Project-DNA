import { chromium } from 'playwright-core';

const BASE = 'http://localhost:3000';
const results = [];
const consoleErrors = [];

function log(step, ok, extra = '') {
  results.push({ step, ok, extra });
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${step}${extra ? ' | ' + extra : ''}`);
}

async function launch() {
  for (const channel of ['msedge', 'chrome']) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // try next channel
    }
  }
  throw new Error('No Chrome/Edge found for playwright-core');
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
const apiCalls = [];
page.on('response', async (r) => {
  const u = r.url();
  if ((u.includes('rest/v1') || u.includes('storage/v1')) && r.status() >= 400) {
    let body = '';
    try { body = (await r.text()).slice(0, 250); } catch {}
    apiCalls.push(r.status() + ' ' + r.request().method() + ' ' + u.slice(0, 130) + ' :: ' + body);
  }
});

try {
  // 1. Home loads with cards
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('article', { timeout: 30000 });
  await page.waitForTimeout(800);
  const cardCount = await page.locator('article').count();
  log('home loads & renders project cards', cardCount > 0, cardCount + ' cards');

  // 2. Pagination
  const pagination = page.locator('nav[aria-label="pagination"]');
  if ((await pagination.count()) > 0 && cardCount >= 12) {
    const firstBefore = await page.locator('article').first().textContent();
    await pagination.locator('button', { hasText: /^2$/ }).first().click();
    await page.waitForTimeout(500);
    const firstAfter = await page.locator('article').first().textContent();
    log('pagination switches to page 2', firstBefore !== firstAfter);

    await page.locator('#jump-page').fill('1');
    await page.locator('#jump-page').press('Enter');
    await page.waitForTimeout(400);
    log('jump-to-page input works', (await page.locator('article').first().textContent()) === firstBefore);
  } else {
    log('pagination visible', false, 'expected with >12 projects');
  }

  // 3. Search filter
  await page.getByLabel('ค้นหาโครงงาน').fill('คราม');
  await page.waitForTimeout(600);
  const sr = await page.locator('article').count();
  log('search filters the catalog', sr > 0 && sr <= cardCount, sr + ' results for kram');
  const clearBtn = page.getByLabel('Clear search');
  if ((await clearBtn.count()) > 0) await clearBtn.click();
  await page.waitForTimeout(400);

  // 4. Tabs render
  const tabs = [
    ['สายการต่อยอด (Lineage)', 'สายวิวัฒนาการ'],
    ['สถิติคลังโครงงาน', 'Analytics'],
    ['โครงงานของฉัน', 'โครงงานของฉัน'],
    ['โครงงานที่บันทึกไว้', null],
  ];
  for (const [tabLabel, expectText] of tabs) {
    await page.locator('button[aria-label="' + tabLabel + '"]').first().click();
    await page.waitForTimeout(600);
    const body = await page.locator('main').textContent();
    log('tab opens: ' + tabLabel, expectText ? body.includes(expectText) : body.length > 100);
  }

  // 5. Create project flow (live AI extraction)
  await page.locator('button[aria-label="สำรวจ DNA โครงงาน"]').first().click();
  await page.waitForTimeout(400);

  const createBtn = page.locator('button[aria-label="เพิ่มโครงงานใหม่"]');
  if ((await createBtn.count()) > 0) {
    log('sidebar has create entry point', true);
    await createBtn.first().click();
    await page.waitForSelector('#abstract-input', { timeout: 5000 });
    log('create modal opens', true);

    await page.locator('#abstract-input').fill('โครงงานนี้พัฒนาระบบตรวจจับคุณภาพน้ำแบบเรียลไทม์ด้วยเซ็นเซอร์ pH และ ESP32 ส่งข้อมูลผ่าน LoRaWAN ประมวลผลบนแดชบอร์ด Next.js เตือนภัยเกษตรกรผ่าน LINE Notify');
    await page.locator('button', { hasText: 'สกัด DNA Card' }).first().click();

    let extractedTitle = '';
    try {
      await page.waitForSelector('text=4. ตรวจสอบผลลัพธ์ก่อนบันทึก', { timeout: 90000 });
      extractedTitle = ((await page.locator('h4').first().textContent()) || '').trim();
      log('AI extraction & preview works', extractedTitle.length > 0, 'title=' + extractedTitle.slice(0, 40));
    } catch {
      const errVisible = await page.locator('text=AI วิเคราะห์ไม่สำเร็จ').count();
      log('AI extraction & preview works', false, errVisible > 0 ? 'error banner shown' : 'timeout 90s');
    }

    await page.locator('input[accept="application/pdf"]').setInputFiles({
      name: 'e2e-report.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\nE2E test document\n%%EOF'),
    });
    await page.waitForTimeout(300);
    log('PDF attachment selected & listed', (await page.locator('text=e2e-report.pdf').count()) > 0);

    await page.locator('button', { hasText: 'บันทึกเข้าสู่คลังโครงงาน DNA' }).first().click();
    await page.waitForTimeout(4000);
    log('save closes modal & publishes', (await page.locator('#abstract-input').count()) === 0);

    await page.waitForTimeout(1000);
    const newCount = await page.locator('article').count();
    const foundNew = extractedTitle
      ? (await page.locator('article:has-text("' + extractedTitle.slice(0, 24) + '")').count()) > 0
      : false;
    log('new project appears in catalog', newCount >= cardCount && foundNew, newCount + ' cards now');
  } else {
    log('sidebar has create entry point', false, 'MISSING - users cannot reach the create modal');
  }

  // 6. Drawer opens from a card
  await page.waitForTimeout(500);
  if ((await page.locator('[role="dialog"]').count()) > 0) {
    log('drawer auto-opens after publish', true);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }
  await page.locator('article').first().click();
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  const drawerText = await page.locator('[role="dialog"]').textContent();
  log('project drawer opens with details', drawerText.includes('โหลดทรัพยากร'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  log('drawer closes with Escape', (await page.locator('[role="dialog"]').count()) === 0);
} catch (e) {
  log('unexpected failure during run', false, e.message.split('\n')[0]);
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log('');
console.log('========== SUMMARY ==========');
console.log('Total: ' + results.length + ' | Pass: ' + (results.length - failed.length) + ' | Fail: ' + failed.length);
failed.forEach((f) => console.log('  FAILED: ' + f.step + (f.extra ? ' (' + f.extra + ')' : '')));
console.log('Console errors captured: ' + consoleErrors.length);
consoleErrors.forEach((e) => console.log('  WARN: ' + e.slice(0, 200)));
process.exit(failed.length > 0 ? 1 : 0);
