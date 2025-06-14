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
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    // Verifica que se muestran los KPIs
    await expect(page.getByRole('tab', { name: 'All Tasks' })).toBeVisible();

    // Cambia a la pestaña de Analytics si existe
    await page.getByRole('button', { name: /quick create/i }).click();

    // Escribimos el nombre
    await page.getByLabel(/task name/i).fill('Tarea Playwright Completa');

    // Escribimos una descripción
    await page.getByLabel(/description/i).fill('Descripción de prueba');

    // Seleccionamos prioridad
    await page.getByLabel(/priority/i).click();
    await page.getByRole('option', { name: /medium/i }).click();

    // Seleccionamos status
    await page.getByRole('combobox', { name: 'Status *' }).click();
    await page.getByRole('option', { name: /to do/i }).click();

    // Seleccionamos tipo
    await page.getByLabel(/type/i).click();
    await page.getByRole('option', { name: /feature/i }).click();

    // Seleccionamos story points
    await page.getByLabel(/story points/i).click();
    await page.getByRole('option', { name: /1 point/i }).click();

    // Seleccionamos sprint (elige el primero disponible)
    await page.getByLabel(/sprint/i).click();
    const sprintOptions = await page.getByRole('option').all();
    if (sprintOptions.length > 0) {
      await sprintOptions[0].click();
    }

    // Seleccionamos fecha de entrega
    await page.getByRole('button', { name: 'Due Date *' }).click();
    // Selecciona el primer día habilitado (ajusta si tu calendario es diferente)
    await page.getByRole('gridcell', { name: '18' }).click();

    // Guardamos la tarea
    await page.getByRole('button', { name: 'Create Task' }).click();

    // Verificamos que se haya creado
    await expect(page.getByText('Tarea Playwright Completa')).toBeVisible();

  });

}, 60000);
