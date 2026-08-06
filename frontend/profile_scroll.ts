// @ts-nocheck
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

  await page.addInitScript(() => {
    const logEvent = (type: any, details: any) => {
      const msg = `[${performance.now().toFixed(2)}ms] ${type} | ${JSON.stringify(details)}`;
      console.log(msg);
    };

    (window as any).reportHeight = () => {
       logEvent('DocumentHeight', { 
         height: document.documentElement.scrollHeight,
         scrollY: window.scrollY,
         maxScrollY: document.documentElement.scrollHeight - window.innerHeight
       });
    };

    // Track scroll position changes and height
    window.addEventListener('DOMContentLoaded', () => {
       let lastHeight = document.documentElement.scrollHeight;
       const observer = new ResizeObserver(() => {
          const newHeight = document.documentElement.scrollHeight;
          if (newHeight !== lastHeight) {
             logEvent('HeightChanged', { old: lastHeight, new: newHeight, scrollY: window.scrollY });
             lastHeight = newHeight;
          }
       });
       observer.observe(document.documentElement);
       observer.observe(document.body);
    });
  });

  console.log("Navigating to home...");
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // Scroll down
  console.log("Scrolling down to prepare for navigation...");
  await page.evaluate(() => {
    window.scrollTo(0, 1500);
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => (window as any).reportHeight());

  console.log("Clicking Explore...");
  await page.evaluate(() => {
    console.log("--- INITIATING NAVIGATION TO /explore ---");
    const link = document.querySelector('a[href="/explore"]');
    if (link) {
      link.click();
    }
  });

  await page.waitForTimeout(4000);
  await page.evaluate(() => (window as any).reportHeight());
  
  console.log("Navigating back to home to try another route...");
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  console.log("Scrolling down...");
  await page.evaluate(() => {
    window.scrollTo(0, 1500);
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => (window as any).reportHeight());

  console.log("Clicking a product...");
  await page.evaluate(() => {
    console.log("--- INITIATING NAVIGATION TO PRODUCT ---");
    const cards = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('/product/'));
    if (cards.length > 0) {
      cards[0].click();
    }
  });

  await page.waitForTimeout(4000);
  await page.evaluate(() => (window as any).reportHeight());

  await browser.close();
})();

