import { test, expect } from '@playwright/test';

test('index page loads and redirects to weekly', async ({ page }) => {
  await page.goto('/');

  // Check URL after redirection
  await expect(page).toHaveURL(/\/weekly/);

  // Check that page loaded successfully
  expect(await page.title()).toBeTruthy();
}); 