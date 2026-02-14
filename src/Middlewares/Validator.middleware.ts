import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validateSchema =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json(error.errors.map((err: any) => err.message));
    }
  };
