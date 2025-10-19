import { test, expect } from '@playwright/test';
import fs from 'fs';

// 📁 Ensure screenshot folder exists
const screenshotDir = 'screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

// 🔧 Helper: Move slider by label and target value
async function moveSliderTo(page, label, targetValue) {
  const slider = page.getByRole('slider', { name: label });
  const min = Number(await slider.getAttribute('aria-valuemin'));
  const max = Number(await slider.getAttribute('aria-valuemax'));
  const box = await slider.boundingBox();

  if (!box) throw new Error(`No bounding box found for ${label}`);

  const percentage = (targetValue - min) / (max - min);
  const targetX = box.x + box.width * percentage;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetX, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();
}

// 🧩 Hook: before each test — take screenshot after each navigation
test.beforeEach(async ({ page }, testInfo) => {
  page.on('framenavigated', async () => {
    try {
      const safeUrl = page.url().replace(/[^\w]/g, '_').slice(0, 100);
      const screenshotPath = `${screenshotDir}/nav_${safeUrl}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach(`Navigation: ${page.url()}`, {
        path: screenshotPath,
        contentType: 'image/png',
      });
      console.log(`📸 Screenshot taken after navigation to: ${page.url()}`);
    } catch (error) {
      console.error('⚠️ Failed to capture navigation screenshot:', error);
    }
  });
});

// 🧩 Hook: after each test — take final screenshot
test.afterEach(async ({ page }, testInfo) => {
  try {
    const safeTitle = testInfo.title.replace(/[^\w]/g, '_');
    const screenshotPath = `${screenshotDir}/${safeTitle}_final.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await testInfo.attach('Final Screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });

    console.log(`✅ Final screenshot saved for test: ${testInfo.title}`);
  } catch (error) {
    console.error('⚠️ Failed to capture final screenshot:', error);
  }
});

// 🚗 Main Test: Filter cars by price and verify results visually
test('Filter cars by price and verify visual state', async ({ page }) => {
  console.log('🔹 Navigating to car rental page...');
  await page.goto('https://www.invygo.com/en-ae/dubai/rent-weekly-nissan-sunny-cars-from-2020');

  console.log('🔹 Waiting for sliders...');
  await page.waitForSelector('[role="slider"]');

  console.log('🔹 Checking if reset button is visible...');
  const resetBtn = page.getByRole('button', { name: /Reset all/i });
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    console.log('🔹 Filters reset.');
  }

  console.log('🔹 Moving sliders...');
  await moveSliderTo(page, 'Minimum', 5000);
  await moveSliderTo(page, 'Maximum', 25000);

  console.log('🔹 Switching to Monthly tab...');
  await page.getByRole('tab', { name: 'Monthly' }).click();

  console.log('🔹 Taking visual snapshot of filter result page...');
  const filterPageScreenshot = await page.screenshot();
  expect(filterPageScreenshot).toMatchSnapshot('filtered-cars-page.png');

  console.log('✅ Visual validation completed successfully!');
});
