import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[Browser ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[Page Error] ${err.message}`);
  });

  page.on('requestfailed', request => {
    console.log(`[Request Failed] ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    console.log('Navigating to http://localhost:3000/explore');
    await page.goto('http://localhost:3000/explore', { waitUntil: 'networkidle' });

    console.log('Clicking on Art category in navbar to open dropdown...');
    await page.click('header a:has-text("Art")');
    
    await page.waitForTimeout(1000);

    console.log('Clicking Digital Art & Illustrations subcategory...');
    await page.click('header a:has-text("Digital Art & Illustrations")');

    await page.waitForTimeout(2000);

    const url = page.url();
    console.log(`Current URL: ${url}`);

    const productCount = await page.locator('a[href^="/product/"]').count();
    console.log(`Products rendered (a[href^="/product/"]): ${productCount}`);

    const isChecked = await page.isChecked('label:has-text("Digital Art & Illustrations") input[type="checkbox"]');
    console.log(`Checkbox checked in sidebar: ${isChecked}`);

  } catch (err: any) {
    console.error('Test script failed:', err.message);
  } finally {
    await browser.close();
  }
}

run();
