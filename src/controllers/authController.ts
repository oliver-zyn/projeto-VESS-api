// src/controllers/authController.ts
import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { CreateUserData, LoginData } from "../types";
import { HTTP_STATUS } from "../utils/constants";
import { asyncHandler } from "../middleware/errorHandler";

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const userData: CreateUserData = req.body;

    const result = await AuthService.register(userData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Usuário registrado com sucesso",
      data: result,
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginData = req.body;

    const result = await AuthService.login(loginData);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Login realizado com sucesso",
      data: result,
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Token de refresh é obrigatório",
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Token renovado com sucesso",
      data: result,
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    // Em um sistema mais complexo, você poderia invalidar o refresh token aqui
    // Por enquanto, apenas retornamos sucesso
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  });

  static verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Token é obrigatório",
      });
    }

    const user = await AuthService.validateAccessToken(token);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: "Token inválido",
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Token válido",
      data: { user },
    });
  });
}
