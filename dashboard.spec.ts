import { test, expect } from '@playwright/test';

test.describe('Flujo login y dashboard analytics', () => {
  test('inicio de sesion, analytics y datos mockeados', async ({ page }) => {
    // Mock KPIs personales
    await page.route('**/api/kpis/self', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ totalTasks: 12, completedTasks: 8 }),
      });
    });

    // Mock KPIs de equipo
    await page.route('**/api/kpis/team', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ totalTeamTasks: 25 }),
      });
    });

    // Mock analytics de sprint (sin tareas completadas)
    await page.route('**/api/sprint-analytics', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ tasks: [] }),
      });
    });

    // Navega a la home
    await page.goto('http://localhost:3000');

    // Click en login
    await page.getByRole('link', { name: /log in/i }).click();

    // Espera a la página de login
    await expect(page).toHaveURL(/\/login/);

    // Completa el formulario y loguea
    await page.getByLabel('Username').fill('IkerManager');
    await page.getByLabel('Password').fill('222');
    await page.getByRole('button', { name: /^login$/i }).click();

    // Espera el redirect
    await expect(page).toHaveURL(/\/redirect/);
    await expect(page.getByText(/redirecting/i)).toBeVisible();
    await expect(page.getByText(/please wait while we redirect you/i)).toBeVisible();

    // Espera a que llegue al dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Verifica que se muestran los KPIs
    await expect(page.getByRole('tab', { name: 'All Tasks' })).toBeVisible();

    // Cambia a la pestaña de Analytics si existe
    const analyticsTab = page.getByRole('tab', { name: /analytics/i });
    if (await analyticsTab.isVisible()) {
      await analyticsTab.click();
    }
  });

  
});
