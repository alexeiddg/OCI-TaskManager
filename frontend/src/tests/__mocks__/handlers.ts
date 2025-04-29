import { rest } from 'msw'

export const handlers = [
  rest.get('/api/task/:id', (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, title: 'Mock Task', assignedTo: 'User A', status: 'IN_PROGRESS', storyPoints: 5 }))
  }),

  rest.post('/api/task/update', async (req, res, ctx) => {
    const task = await req.json()
    return res(ctx.json({ ...task }))
  }),

  rest.get('/api/sprint/:id/analytics', (req, res, ctx) => {
    return res(ctx.json({
      completedTasks: [
        { title: 'Done Task', developer: 'Dev A', estimatedHours: 5, actualHours: 6 }
      ]
    }))
  }),

  rest.get('/api/project', (req, res, ctx) => {
    const role = req.url.searchParams.get('role')
    return res(ctx.json({ role, dashboardInfo: `Dashboard for ${role}` }))
  }),

  rest.get('/api/kpis', (req, res, ctx) => {
    return res(ctx.json({ totalHours: 40, completedTasks: 12 }))
  }),

  rest.get('/api/task/:id/logs', (req, res, ctx) => {
    return res(ctx.json([{ log: 'Task started', developer: 'User A' }]))
  }),
]