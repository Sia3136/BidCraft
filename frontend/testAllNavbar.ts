import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:3000/explore');
    await page.goto('http://localhost:3000/explore', { waitUntil: 'networkidle' });

    const categories = ['Art', 'Collectibles', 'Gaming & Hobby', 'Handmade & Crafts', 'Lifestyle & Gifts'];

    for (const cat of categories) {
      console.log(`\nOpening ${cat} dropdown...`);
      await page.click(`header a:has-text("${cat}")`);
      await page.waitForTimeout(500);

      // find all subcategory links in the dropdown
      const subLinks = await page.locator(`header a:has-text("${cat}") + div a`).allTextContents();
      // wait, the dropdown is absolute positioned, not adjacent.
      // The dropdown text contents can be found by looking at the AnimatePresence children.
      // Let's just select all links in the dropdown.
      const links = await page.locator('header motion.div a').allTextContents();
      
      console.log(`Found links: ${links.join(', ')}`);
      
      for (const sub of links) {
        console.log(`Clicking ${sub}...`);
        
        // Ensure dropdown is open
        const isVisible = await page.locator(`header a:has-text("${sub}")`).isVisible();
        if (!isVisible) {
          await page.click(`header a:has-text("${cat}")`);
          await page.waitForTimeout(500);
        }

        await page.click(`header a:has-text("${sub}")`);
        await page.waitForTimeout(1000); // Wait for navigation

        const url = page.url();
        const productCount = await page.locator('a[href^="/product/"]').count();
        console.log(`  -> URL: ${url}, Products: ${productCount}`);
      }
    }
  } catch (err: any) {
    console.error('Test script failed:', err.message);
  } finally {
    await browser.close();
  }
}

run();
