// tests/mocks/handlers.ts
import { http } from "msw"; // Esto debería funcionar con la versión más reciente de MSW

// Aquí defines tus handlers
export const handlers = [
  http.get("/api/example", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: "Hello World!" }));
  }),
  // Puedes agregar más handlers según tus necesidades
];
