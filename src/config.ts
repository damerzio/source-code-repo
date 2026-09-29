/** Runtime defaults. Every value can be overridden with the matching environment variable. */
export const config = {
  port: Number(process.env.PORT ?? 8080),
  /** Requests that take longer are aborted with 504 REQUEST_TIMEOUT. */
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 60_000),
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  rateLimit: {
    /** Requests per API key per minute. */
    requestsPerMinute: 120,
  },
  tasks: {
    maxTitleLength: 200,
    maxTagsPerTask: 10,
  },
};
