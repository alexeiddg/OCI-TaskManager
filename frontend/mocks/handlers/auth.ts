import { http, HttpResponse } from 'msw';

export const userHandlers = [
    http.get('/api/user', () => {
        return HttpResponse.json({ id: '123', name: 'John Doe' });
    }),
];
