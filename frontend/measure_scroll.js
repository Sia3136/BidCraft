const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Loading Home...");
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  
  console.log("Scrolling down to simulate user position...");
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(500);
  
  const getHeightInfo = async () => {
    return await page.evaluate(() => {
      return {
        height: document.documentElement.scrollHeight,
        scrollY: window.scrollY
      };
    });
  };
  
  console.log("Before navigation:", await getHeightInfo());
  
  const measurements = [];
  const poll = setInterval(async () => {
    try {
      const info = await getHeightInfo();
      // Only keep distinct consecutive values to reduce noise
      if (measurements.length === 0 || 
          measurements[measurements.length-1].height !== info.height || 
          Math.abs(measurements[measurements.length-1].scrollY - info.scrollY) > 5) {
        measurements.push(info);
      }
    } catch(e) {}
  }, 50);

  console.log("Clicking 'Explore'...");
  await page.evaluate(() => {
    const link = document.querySelector('a[href="/explore"]');
    if (link) link.click();
  });
  
  await page.waitForTimeout(3000);
  clearInterval(poll);
  
  console.log("Navigation complete.");
  console.log("Recorded Height/Scroll changes during transition:");
  measurements.forEach((m, i) => {
    console.log(`  Step ${i}: Height: ${m.height}px, scrollY: ${Math.round(m.scrollY)}px`);
  });
  
  console.log("Destination page:", await getHeightInfo());
  
  await browser.close();
})();
