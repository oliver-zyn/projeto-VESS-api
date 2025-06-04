// src/middleware/validation.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { HTTP_STATUS } from "../utils/constants";

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "Dados inválidos",
          details: errorMessages,
        });
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "Parâmetros inválidos",
          details: error.errors,
        });
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "Query inválida",
          details: error.errors,
        });
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  };
};
