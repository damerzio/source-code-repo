import type { NextFunction, Request, Response } from 'express';

import { ApiError } from './errors';

export const API_KEY_HEADER = 'X-Acme-Key';

export function requireApiKey(req: Request, _res: Response, next: NextFunction) {
  const key = req.header(API_KEY_HEADER);

  if (!key) {
    return next(new ApiError(401, 'MISSING_API_KEY', `Send your API key in the ${API_KEY_HEADER} header.`));
  }

  if (!key.startsWith('acme_live_') && !key.startsWith('acme_test_')) {
    return next(new ApiError(401, 'INVALID_API_KEY', 'The API key is not valid.'));
  }

  next();
}
