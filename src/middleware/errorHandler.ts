// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../utils/constants";
import env from "../config/env";

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = error.message || "Erro interno do servidor";

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = HTTP_STATUS.CONFLICT;
        message = "Dados já existem no sistema";
        break;
      case "P2025":
        statusCode = HTTP_STATUS.NOT_FOUND;
        message = "Registro não encontrado";
        break;
      case "P2003":
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = "Violação de chave estrangeira";
        break;
      default:
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = "Erro de banco de dados";
    }
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Dados inválidos fornecidos";
  }

  // Log error in development
  if (env.NODE_ENV === "development") {
    console.error("Error:", error);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Rota ${req.method} ${req.path} não encontrada`,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
