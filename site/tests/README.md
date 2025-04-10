# End-to-End Testing with Playwright

This directory contains end-to-end tests for the ctxs.ai website using Playwright.

## Running Tests

To run the tests, use:

```bash
# Run all tests
bun run test

# Run tests with UI
bun run test:ui

# Run a specific test file
bun playwright test tests/index.spec.ts

# Run tests in a specific browser
bun playwright test --project=chromium
```

## Writing Tests

Tests are written using Playwright's test framework. Each test file should be named with a `.spec.ts` extension.

Examples:

```typescript
// Basic test
test('page has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ctxs/);
});

// Testing navigation
test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveURL(/.*about/);
});
```

## CI Integration

Tests are automatically run in GitHub Actions on push to the main branch and on pull requests. The results are uploaded as artifacts and can be viewed in the GitHub Actions UI. 