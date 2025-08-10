import express from 'express';
import type { Express, Request, Response } from 'express';

const app: Express = express();

app.get('/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

export default app;
