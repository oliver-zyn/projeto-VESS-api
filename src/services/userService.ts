// vess-api/src/services/userService.ts (CORRIGIDO)
import prisma from "../config/database";
import { UpdateUserData } from "../types";
import { CustomError } from "../middleware/errorHandler";
import { HTTP_STATUS } from "../utils/constants";

export class UserService {
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        country: true,
        cityState: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      const error = new Error("Usuário não encontrado") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    console.log("Usuário encontrado no banco:", {
      id: user.id,
      email: user.email,
      name: user.name,
      address: user.address,
      country: user.country,
      cityState: user.cityState,
      language: user.language,
    });

    return user;
  }

  static async updateUserProfile(userId: string, updateData: UpdateUserData) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      const error = new Error("Usuário não encontrado") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    console.log("Dados para atualização:", updateData);

    const dataToUpdate: any = {};

    if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
    if (updateData.address !== undefined)
      dataToUpdate.address = updateData.address;
    if (updateData.country !== undefined)
      dataToUpdate.country = updateData.country;
    if (updateData.cityState !== undefined)
      dataToUpdate.cityState = updateData.cityState;
    if (updateData.language !== undefined)
      dataToUpdate.language = updateData.language;

    console.log("Dados finais para atualização:", dataToUpdate);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        country: true,
        cityState: true,
        language: true,
        updatedAt: true,
      },
    });

    console.log("Usuário atualizado:", updatedUser);

    return updatedUser;
  }

  static async deleteUser(userId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      const error = new Error("Usuário não encontrado") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "Usuário deletado com sucesso" };
  }

  static async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("Usuário não encontrado") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    const totalEvaluations = await prisma.evaluation.count({
      where: { userId },
    });

    const totalSamples = await prisma.sample.count({
      where: {
        evaluation: {
          userId,
        },
      },
    });

    const memberSince = user.createdAt;

    const lastEvaluation = await prisma.evaluation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        date: true,
        averageScore: true,
      },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const evaluationsThisMonth = await prisma.evaluation.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    return {
      totalEvaluations,
      totalSamples,
      memberSince,
      lastEvaluation,
      evaluationsThisMonth,
    };
  }
}
