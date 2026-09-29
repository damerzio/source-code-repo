export type ErrorCode =
  | 'MISSING_API_KEY'
  | 'INVALID_API_KEY'
  | 'TASK_NOT_FOUND'
  | 'VALIDATION_FAILED'
  | 'RATE_LIMITED'
  | 'REQUEST_TIMEOUT';

export class ApiError extends Error {
  constructor(
    readonly status: 401 | 404 | 422 | 429 | 504,
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export function toErrorBody(err: ApiError) {
  return { error: { code: err.code, message: err.message } };
}
