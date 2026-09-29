import express, { type NextFunction, type Request, type Response } from 'express';

import { requireApiKey } from './auth';
import { config } from './config';
import { ApiError, toErrorBody } from './errors';
import { tasksRouter } from './routes/tasks';

const app = express();

app.use(express.json());
app.use(requireApiKey);
app.use(tasksRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json(toErrorBody(err));
  }
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Unexpected error.' } });
});

app.listen(config.port, () => {
  console.log(`acme-tasks-api listening on :${config.port}`);
});
