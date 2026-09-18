import { expect, test } from '@playwright/test';
import path from 'path';

test('home page loads with no console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  await page.goto('http://localhost:8080');
  await expect(page.locator('body')).toContainText(/Grow with clarity|প্রতিদিন স্পষ্ট তথ্য|हर दिन सही/i);
  expect(consoleErrors).toEqual([]);
});

test('language switch to Bengali renders Bengali text', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.getByRole('button', { name: 'বাং' }).click();
  await expect(page.locator('body')).toContainText('কৃষক ড্যাশবোর্ড');
  await expect(page.locator('body')).toContainText('ফসল পরীক্ষা শুরু করুন');
});

test('uploading a fixture leaf image produces a diagnosis with confidence', async ({ page }) => {
  await page.goto('http://localhost:8080/diagnose');

  const leafPath = path.resolve(__dirname, '../frontend/desktop-tutorial/test_leaf.jpg');
  await page.locator('input[type="file"]').setInputFiles(leafPath);

  await page.getByLabel('Crop Type').selectOption({ label: 'Rice' });
  await page.getByLabel('Growth Stage').selectOption({ label: 'Seedling' });
  await page.getByLabel('District (West Bengal)').selectOption({ label: 'Kolkata' });
  await page.getByRole('button', { name: /Analyze/i }).click();

  const response = await page.waitForResponse((res) => res.url().includes('/api/v1/diagnose') && res.status() === 200);
  const json = await response.json();

  expect(json.confidence).toBeGreaterThan(0);
  expect(json.primaryDiagnosis).toBeTruthy();
  await expect(page.locator('body')).toContainText(/Rice|ধান|धान/i);
});

test('recommendations section shows organic, chemical and preventive blocks', async ({ page }) => {
  await page.goto('http://localhost:8080/diagnose');

  const leafPath = path.resolve(__dirname, '../frontend/desktop-tutorial/test_leaf.jpg');
  await page.locator('input[type="file"]').setInputFiles(leafPath);
  await page.getByLabel('Crop Type').selectOption({ label: 'Rice' });
  await page.getByLabel('Growth Stage').selectOption({ label: 'Seedling' });
  await page.getByLabel('District (West Bengal)').selectOption({ label: 'Kolkata' });
  await page.getByRole('button', { name: /Analyze/i }).click();

  await page.waitForResponse((res) => res.url().includes('/api/v1/diagnose') && res.status() === 200);

  await expect(page.getByText(/Step 1: Organic|ধাপ ১: জৈব|चरण 1: जैविक/i)).toBeVisible();
  await expect(page.getByText(/Step 2: Chemical|ধাপ ২: রাসায়নিক|चरण 2: रासायनिक/i)).toBeVisible();
  await expect(page.getByText(/Step 3: Prevention|ধাপ ৩: প্রতিরোধ|चरण 3: रोकथाम/i)).toBeVisible();
});
