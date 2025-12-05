import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 0,
  expect: { timeout: 0 },
  use: {
    headless: true, //อยากเห็นตอนรันให้ตั้ง false
    actionTimeout: 10000,
    navigationTimeout: 0,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }
  ]
});

