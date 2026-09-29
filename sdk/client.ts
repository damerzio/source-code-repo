import type { Task, TaskPriority, TaskStatus } from '../src/tasks';

export type ClientOptions = {
  apiKey: string;
  /** Defaults to https://api.acme.example */
  baseUrl?: string;
};

export function createClient({ apiKey, baseUrl = 'https://api.acme.example' }: ClientOptions) {
  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { 'X-Acme-Key': apiKey, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`Acme API error ${res.status}`);
    }
    return (res.status === 204 ? undefined : await res.json()) as T;
  }

  return {
    tasks: {
      list: (params: { status?: TaskStatus; limit?: number } = {}) =>
        request<{ data: Task[]; nextCursor: string | null }>(
          'GET',
          `/v1/tasks?${new URLSearchParams(params as Record<string, string>)}`,
        ),
      create: (input: { title: string; priority?: TaskPriority; tags?: string[] }) =>
        request<Task>('POST', '/v1/tasks', input),
      get: (taskId: string) => request<Task>('GET', `/v1/tasks/${taskId}`),
      delete: (taskId: string) => request<void>('DELETE', `/v1/tasks/${taskId}`),
    },
  };
}
