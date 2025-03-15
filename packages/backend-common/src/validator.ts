import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema<any>) =>
  (data: any, errorHandler: (error: any) => void): void => {
    try {
      schema.parse(data);
    } catch (error) {
      errorHandler(error);
    }
  };
