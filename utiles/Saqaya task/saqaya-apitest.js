import { test, expect, request } from '@playwright/test';

test('Google search for Playwright returns status 200 and includes keyword', async ({}) => {
  // Create a new API request context
  const apiContext = await request.newContext();

  // Send a GET request to Google Search with query "playwright"
  const response = await apiContext.get('https://www.google.com/search?q=saqaya');

  // Assert that the response status is 200
  expect(response.status()).toBe(200);

  // Get the response body as text (HTML)
  const body = await response.text();

  // Assert that "Playwright" appears in the response body
  expect(body.toLowerCase()).toContain('saqaya');

  // Log success messages
  console.log('✅ Status Code:', response.status());
  console.log('✅ Body contains the word "saqaya".');

  // Clean up context
  await apiContext.dispose();
});
