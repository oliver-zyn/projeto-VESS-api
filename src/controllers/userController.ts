// src/controllers/userController.ts
import { Response } from "express";
import { UserService } from "../services/userService";
import { AuthRequest, UpdateUserData } from "../types";
import { HTTP_STATUS } from "../utils/constants";
import { asyncHandler } from "../middleware/errorHandler";

export class UserController {
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    const user = await UserService.getUserProfile(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user,
    });
  });

  static updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const updateData: UpdateUserData = req.body;

      const updatedUser = await UserService.updateUserProfile(
        userId,
        updateData
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Perfil atualizado com sucesso",
        data: updatedUser,
      });
    }
  );

  static deleteAccount = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;

      const result = await UserService.deleteUser(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message,
      });
    }
  );

  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    const stats = await UserService.getUserStats(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: stats,
    });
  });
}
