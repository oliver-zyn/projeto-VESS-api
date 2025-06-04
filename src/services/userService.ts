// src/services/userService.ts
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

    return user;
  }

  static async updateUserProfile(userId: string, updateData: UpdateUserData) {
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      const error = new Error("Usuário não encontrado") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    return updatedUser;
  }

  static async deleteUser(userId: string) {
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      const error = new Error("Usuário não encontrado") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Deletar usuário (cascata vai deletar avaliações relacionadas)
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "Usuário deletado com sucesso" };
  }

  static async getUserStats(userId: string) {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("Usuário não encontrado") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Buscar estatísticas
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

    // Data de cadastro
    const memberSince = user.createdAt;

    // Última avaliação
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

    // Avaliações este mês
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
