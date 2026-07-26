import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:3000/explore');
    await page.goto('http://localhost:3000/explore', { waitUntil: 'networkidle' });

    console.log('Clicking Digital Art...');
    await page.click('header a:has-text("Art")');
    await page.waitForTimeout(500);
    await page.click('header a:has-text("Digital Art & Illustrations")');
    await page.waitForTimeout(2000);

    let url = page.url();
    let productCount = await page.locator('a[href^="/product/"]').count();
    console.log(`URL 1: ${url}, Products: ${productCount}`);

    console.log('Clicking Paintings...');
    await page.click('header a:has-text("Art")');
    await page.waitForTimeout(500);
    await page.click('header a:has-text("Paintings")');
    await page.waitForTimeout(2000);

    url = page.url();
    productCount = await page.locator('a[href^="/product/"]').count();
    console.log(`URL 2: ${url}, Products: ${productCount}`);

  } catch (err: any) {
    console.error('Test script failed:', err.message);
  } finally {
    await browser.close();
  }
}

run();
