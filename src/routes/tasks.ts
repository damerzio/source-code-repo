import { Router } from 'express';

import { config } from '../config';
import { ApiError } from '../errors';
import { DEFAULT_PRIORITY, TASK_PRIORITIES, TASK_STATUSES, type Task } from '../tasks';

const tasks = new Map<string, Task>();

export const tasksRouter = Router();

// GET /v1/tasks?status=open&limit=20&cursor=...
tasksRouter.get('/v1/tasks', (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? config.pagination.defaultLimit), config.pagination.maxLimit);
  const status = req.query.status as string | undefined;

  if (status && !TASK_STATUSES.includes(status as never)) {
    throw new ApiError(422, 'VALIDATION_FAILED', `status must be one of: ${TASK_STATUSES.join(', ')}`);
  }

  const items = [...tasks.values()].filter((t) => !status || t.status === status).slice(0, limit);
  res.json({ data: items, nextCursor: null });
});

// POST /v1/tasks
tasksRouter.post('/v1/tasks', (req, res) => {
  const { title, priority = DEFAULT_PRIORITY, tags = [] } = req.body ?? {};

  if (typeof title !== 'string' || title.length === 0 || title.length > config.tasks.maxTitleLength) {
    throw new ApiError(422, 'VALIDATION_FAILED', `title is required, up to ${config.tasks.maxTitleLength} characters`);
  }
  if (!TASK_PRIORITIES.includes(priority)) {
    throw new ApiError(422, 'VALIDATION_FAILED', `priority must be one of: ${TASK_PRIORITIES.join(', ')}`);
  }
  if (tags.length > config.tasks.maxTagsPerTask) {
    throw new ApiError(422, 'VALIDATION_FAILED', `a task can have at most ${config.tasks.maxTagsPerTask} tags`);
  }

  const task: Task = {
    id: `tsk_${Date.now()}`,
    title,
    status: 'open',
    priority,
    tags,
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, task);
  res.status(201).json(task);
});

// GET /v1/tasks/:taskId
tasksRouter.get('/v1/tasks/:taskId', (req, res) => {
  const task = tasks.get(req.params.taskId);
  if (!task) {
    throw new ApiError(404, 'TASK_NOT_FOUND', 'No task with this ID.');
  }
  res.json(task);
});

// DELETE /v1/tasks/:taskId
tasksRouter.delete('/v1/tasks/:taskId', (req, res) => {
  if (!tasks.delete(req.params.taskId)) {
    throw new ApiError(404, 'TASK_NOT_FOUND', 'No task with this ID.');
  }
  res.status(204).end();
});
