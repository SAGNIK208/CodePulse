import { Request, Response, NextFunction } from 'express';
import { validate } from '@repo/backend-common/validator';

export const validateMiddleware =
  (schema:any) =>
  (req: Request, res: Response, next: NextFunction) => {
    validate(schema)(req.body, (error) => {
      res.status(400).json({
        success: false,
        message: 'Invalid request params received',
        data: {},
        error: error instanceof Error ? error.message : error,
      });
    });

    next(); // Proceed only if validation passes
  };