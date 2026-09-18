# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> uploading a fixture leaf image produces a diagnosis with confidence
- Location: e2e\smoke.spec.ts:25:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - link "🌾 FasalSathi" [ref=e7] [cursor=pointer]:
        - /url: /
        - generic [ref=e8]: 🌾
        - generic [ref=e9]: FasalSathi
      - generic [ref=e10]:
        - link "🏠 Home" [ref=e11] [cursor=pointer]:
          - /url: /
          - generic [ref=e12]: 🏠
          - generic [ref=e13]: Home
        - link "🔍 Diagnose" [ref=e14] [cursor=pointer]:
          - /url: /diagnose
          - generic [ref=e15]: 🔍
          - generic [ref=e16]: Diagnose
        - link "📊 Official Dashboard" [ref=e17] [cursor=pointer]:
          - /url: /admin/dashboard
          - generic [ref=e18]: 📊
          - generic [ref=e19]: Official Dashboard
      - generic [ref=e20]:
        - button "⋯ More" [ref=e22] [cursor=pointer]:
          - generic [ref=e23]: ⋯
          - generic [ref=e24]: More
        - generic [ref=e27]:
          - button "EN" [ref=e28] [cursor=pointer]
          - button "বাং" [ref=e29] [cursor=pointer]
          - button "हिं" [ref=e30] [cursor=pointer]
  - main [ref=e31]:
    - generic [ref=e33]:
      - heading "🌿 Diagnose Your Crop" [level=2] [ref=e34]:
        - generic [ref=e35]: 🌿
        - text: Diagnose Your Crop
      - generic [ref=e36]:
        - generic [ref=e38]:
          - img "Crop preview" [ref=e39]
          - generic [ref=e40]: ⚠️ Low resolution or lighting - ensure leaf is close & bright
          - button "Remove image" [ref=e41] [cursor=pointer]
          - button "Choose a different image" [ref=e44] [cursor=pointer]
        - paragraph [ref=e45]: Use one clear leaf in natural light. Avoid people, tables, documents, and distant plants.
        - generic [ref=e46]:
          - generic [ref=e47]:
            - generic [ref=e48]: Crop Type
            - combobox "Crop Type" [ref=e49]:
              - option "Select Crop"
              - option "Rice" [selected]
              - option "Potato"
              - option "Jute"
              - option "Mustard"
              - option "Tea"
              - option "Tomato"
              - option "Brinjal"
              - option "Chilli"
              - option "Mango"
              - option "Wheat"
              - option "Maize"
          - generic [ref=e50]:
            - generic [ref=e51]: Growth Stage
            - combobox "Growth Stage" [ref=e52]:
              - option "Select Stage"
              - option "Seedling" [selected]
              - option "Vegetative"
              - option "tillering"
              - option "Flowering"
              - option "grain-filling"
              - option "Harvest"
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]: District (West Bengal)
            - combobox "District (West Bengal)" [ref=e56]:
              - option "Select District"
              - option "Alipurduar"
              - option "Bankura"
              - option "Birbhum"
              - option "Cooch Behar"
              - option "Dakshin Dinajpur"
              - option "Darjeeling"
              - option "Hooghly"
              - option "Howrah"
              - option "Jalpaiguri"
              - option "Jhargram"
              - option "Kalimpong"
              - option "Kolkata" [selected]
              - option "Malda"
              - option "Murshidabad"
              - option "Nadia"
              - option "North 24 Parganas"
              - option "Paschim Bardhaman"
              - option "Paschim Medinipur"
              - option "Purba Bardhaman"
              - option "Purba Medinipur"
              - option "Purulia"
              - option "South 24 Parganas"
              - option "Uttar Dinajpur"
          - generic [ref=e57]:
            - generic [ref=e58]: Location
            - generic [ref=e59]:
              - textbox "Lat" [ref=e60]
              - textbox "Lon" [ref=e61]
            - button "📍 Use My Location" [ref=e62] [cursor=pointer]
        - generic [ref=e63]:
          - generic [ref=e64]:
            - generic [ref=e65]: Observations (Optional)
            - button "🎤 Voice input" [ref=e66] [cursor=pointer]
          - textbox "Describe any other symptoms you see..." [ref=e68]
        - paragraph [ref=e69]: Your image is used for this diagnosis and is removed from temporary processing storage after analysis.
        - generic [ref=e70]: Diagnosis failed. Please try again.
        - button "🔍 Analyze" [ref=e71] [cursor=pointer]
  - contentinfo [ref=e72]:
    - generic [ref=e73]:
      - generic [ref=e74]:
        - generic [ref=e75]:
          - generic [ref=e76]:
            - generic [ref=e77]: 🌾
            - generic [ref=e78]: FasalSathi
          - paragraph [ref=e79]: AI-powered crop disease advisor for West Bengal farmers
          - paragraph [ref=e80]: v1.0.0
        - generic [ref=e81]:
          - heading "Navigation" [level=4] [ref=e82]
          - list [ref=e83]:
            - listitem [ref=e84]:
              - link "Dashboard" [ref=e85] [cursor=pointer]:
                - /url: /
            - listitem [ref=e86]:
              - link "Crop Diagnosis" [ref=e87] [cursor=pointer]:
                - /url: /diagnose
            - listitem [ref=e88]:
              - link "About" [ref=e89] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e90]:
              - link "Farmer Profile" [ref=e91] [cursor=pointer]:
                - /url: /profile
            - listitem [ref=e92]:
              - link "Mobile app view" [ref=e93] [cursor=pointer]:
                - /url: /?mode=mobile
            - listitem [ref=e94]:
              - link "PC workspace" [ref=e95] [cursor=pointer]:
                - /url: /?mode=desktop
        - generic [ref=e96]:
          - heading "Resources" [level=4] [ref=e97]
          - list [ref=e98]:
            - listitem [ref=e99]:
              - link "Setup Guide" [ref=e100] [cursor=pointer]:
                - /url: https://github.com/sd967967-ship-it/Agriculture-FoodTech/blob/main/SETUP_GUIDE.md
            - listitem [ref=e101]:
              - link "GitHub Repository" [ref=e102] [cursor=pointer]:
                - /url: https://github.com/sd967967-ship-it/Agriculture-FoodTech
            - listitem [ref=e103]:
              - link "API Docs" [ref=e104] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e105]:
          - heading "Support" [level=4] [ref=e106]
          - list [ref=e107]:
            - listitem [ref=e108]:
              - link "FAQ" [ref=e109] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e110]:
              - link "Help Center" [ref=e111] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e112]:
              - link "Contact Us" [ref=e113] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e115]:
        - generic [ref=e116]:
          - paragraph [ref=e117]: © 2026 FasalSathi. Built with ❤️ for West Bengal Farmers.
          - paragraph [ref=e118]: Using React, Spring Boot, TorchScript ML Models
        - generic [ref=e119]:
          - link "Twitter" [ref=e120] [cursor=pointer]:
            - /url: "#"
          - link "GitHub" [ref=e123] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | test('home page loads with no console errors', async ({ page }) => {
  5  |   const consoleErrors: string[] = [];
  6  |   page.on('console', (msg) => {
  7  |     if (msg.type() === 'error') consoleErrors.push(msg.text());
  8  |   });
  9  |   page.on('pageerror', (error) => {
  10 |     consoleErrors.push(error.message);
  11 |   });
  12 | 
  13 |   await page.goto('http://localhost:8080');
  14 |   await expect(page.locator('body')).toContainText(/Grow with clarity|প্রতিদিন স্পষ্ট তথ্য|हर दिन सही/i);
  15 |   expect(consoleErrors).toEqual([]);
  16 | });
  17 | 
  18 | test('language switch to Bengali renders Bengali text', async ({ page }) => {
  19 |   await page.goto('http://localhost:8080');
  20 |   await page.getByRole('button', { name: 'বাং' }).click();
  21 |   await expect(page.locator('body')).toContainText('কৃষক ড্যাশবোর্ড');
  22 |   await expect(page.locator('body')).toContainText('ফসল পরীক্ষা শুরু করুন');
  23 | });
  24 | 
  25 | test('uploading a fixture leaf image produces a diagnosis with confidence', async ({ page }) => {
  26 |   await page.goto('http://localhost:8080/diagnose');
  27 | 
  28 |   const leafPath = path.resolve(__dirname, '../frontend/desktop-tutorial/test_leaf.jpg');
  29 |   await page.locator('input[type="file"]').setInputFiles(leafPath);
  30 | 
  31 |   await page.getByLabel('Crop Type').selectOption({ label: 'Rice' });
  32 |   await page.getByLabel('Growth Stage').selectOption({ label: 'Seedling' });
  33 |   await page.getByLabel('District (West Bengal)').selectOption({ label: 'Kolkata' });
  34 |   await page.getByRole('button', { name: /Analyze/i }).click();
  35 | 
> 36 |   const response = await page.waitForResponse((res) => res.url().includes('/api/v1/diagnose') && res.status() === 200);
     |                               ^ Error: page.waitForResponse: Test timeout of 60000ms exceeded.
  37 |   const json = await response.json();
  38 | 
  39 |   expect(json.confidence).toBeGreaterThan(0);
  40 |   expect(json.primaryDiagnosis).toBeTruthy();
  41 |   await expect(page.locator('body')).toContainText(/Rice|ধান|धान/i);
  42 | });
  43 | 
  44 | test('recommendations section shows organic, chemical and preventive blocks', async ({ page }) => {
  45 |   await page.goto('http://localhost:8080/diagnose');
  46 | 
  47 |   const leafPath = path.resolve(__dirname, '../frontend/desktop-tutorial/test_leaf.jpg');
  48 |   await page.locator('input[type="file"]').setInputFiles(leafPath);
  49 |   await page.getByLabel('Crop Type').selectOption({ label: 'Rice' });
  50 |   await page.getByLabel('Growth Stage').selectOption({ label: 'Seedling' });
  51 |   await page.getByLabel('District (West Bengal)').selectOption({ label: 'Kolkata' });
  52 |   await page.getByRole('button', { name: /Analyze/i }).click();
  53 | 
  54 |   await page.waitForResponse((res) => res.url().includes('/api/v1/diagnose') && res.status() === 200);
  55 | 
  56 |   await expect(page.getByText(/Step 1: Organic|ধাপ ১: জৈব|चरण 1: जैविक/i)).toBeVisible();
  57 |   await expect(page.getByText(/Step 2: Chemical|ধাপ ২: রাসায়নিক|चरण 2: रासायनिक/i)).toBeVisible();
  58 |   await expect(page.getByText(/Step 3: Prevention|ধাপ ৩: প্রতিরোধ|चरण 3: रोकथाम/i)).toBeVisible();
  59 | });
  60 | 
```