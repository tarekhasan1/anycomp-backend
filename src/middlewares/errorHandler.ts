// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const errorHandler = (
  err: Error | ApiError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = err.issues.map((issue: any) => ({
      field: issue.path.join('.') || 'unknown',
      message: issue.message,
      code: issue.code,
    }));
  } else if (err.name === 'QueryFailedError') {
    statusCode = 400;
    message = 'Database query failed';
  } else if (err.name === 'EntityNotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.name === 'TypeORMError') {
    statusCode = 400;
    message = 'Database error';
  }

  // Log error in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      statusCode,
    });
  } else {
    // Log in development for debugging
    console.error('Error:', err);
  }

  res.status(statusCode).json(ApiResponse.error(message, errors));
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(
    ApiResponse.error(`Route ${req.method} ${req.url} not found`)
  );
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};