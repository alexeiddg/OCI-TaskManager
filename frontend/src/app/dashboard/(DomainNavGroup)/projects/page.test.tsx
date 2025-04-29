import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ProjectsPage from './page'; // Ajusta si hay exportación diferente
import '@testing-library/jest-dom';

// Simulamos una API que regresa tareas asignadas
const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          name: 'Implementar login',
          developer: 'Juan',
          storyPoints: 3,
          estimatedHours: 5,
          actualHours: 4,
          completed: false,
        },
        {
          id: '2',
          name: 'Fix bug dashboard',
          developer: 'Lucía',
          storyPoints: 2,
          estimatedHours: 3,
          actualHours: 3,
          completed: true,
        },
      ])
    );
  })
);

// Configuramos el mock antes de cada test
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProjectsPage - Visualización de tareas', () => {
  // Happy path básico
  it('muestra tareas asignadas correctamente', async () => {
    render(<ProjectsPage />);

    // Esperamos que aparezca el nombre de una tarea
    expect(await screen.findByText('Implementar login')).toBeInTheDocument();
    expect(await screen.findByText('Fix bug dashboard')).toBeInTheDocument();

    // Validamos que los nombres de los desarrolladores estén visibles
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Lucía')).toBeInTheDocument();
  });

  // Snapshot para detectar cambios visuales inesperados
  it('coincide con el snapshot', async () => {
    const { container } = render(<ProjectsPage />);
    await waitFor(() => screen.getByText('Implementar login'));
    expect(container).toMatchSnapshot();
  });
});
