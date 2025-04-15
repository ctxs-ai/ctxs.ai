import { test, expect } from '@playwright/test';

test('about page loads correctly', async ({ page }) => {
  await page.goto('/about');

  // Check that the page loaded successfully
  await expect(page).toHaveURL(/.*about/);

  // Check that the page title contains expected text
  expect(await page.title()).toBeTruthy();

  // Verify some content on the page
  await expect(page.locator('body')).toContainText(/about/i);
}); 