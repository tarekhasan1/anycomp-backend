// src/middlewares/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

type AnyZodObject = ZodObject<ZodRawShape>;

export const validate =
  (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      
      const validated = await schema.parseAsync(data);
      
      if (source === 'body') {
        req.body = validated;
      } else if (source === 'query') {
        req.query = validated as any;
      } else {
        req.params = validated as any;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return next(
          new ApiError(400, 'Validation failed', errors)
        );
      }
      next(error);
    }
  };