// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './', // Ajusta a tu estructura si es diferente
  testMatch: '**/*.spec.*', // Solo archivos con `.spec.` en el nombre
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
});
