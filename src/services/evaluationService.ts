// src/services/evaluationService.ts
import prisma from "../config/database";
import { EvaluationData, PaginationQuery, EvaluationStats } from "../types";
import { CustomError } from "../middleware/errorHandler";
import { HTTP_STATUS, PAGINATION } from "../utils/constants";
import {
  calculateSampleScore,
  calculateEvaluationAverageScore,
  categorizeScore,
} from "./vessCalculations";

export class EvaluationService {
  static async createEvaluation(
    userId: string,
    evaluationData: EvaluationData
  ) {
    return await prisma.$transaction(async (tx) => {
      // Criar avaliação
      const evaluation = await tx.evaluation.create({
        data: {
          name: evaluationData.name,
          date: evaluationData.date,
          startTime: evaluationData.startTime,
          endTime: evaluationData.endTime,
          managementDescription: evaluationData.managementDescription,
          userId,
          averageScore: 0, // Será calculado depois
        },
      });

      const sampleScores: number[] = [];

      // Criar amostras e camadas
      for (const sampleData of evaluationData.samples) {
        // Calcular escore da amostra
        const sampleScore = calculateSampleScore(sampleData.layers);
        sampleScores.push(sampleScore);

        // Criar amostra
        const sample = await tx.sample.create({
          data: {
            name: sampleData.name,
            location: sampleData.location,
            otherInfo: sampleData.otherInfo,
            managementDecision: sampleData.managementDecision,
            sampleScore,
            evaluationId: evaluation.id,
          },
        });

        // Criar camadas
        const layersData = sampleData.layers.map((layer) => ({
          length: layer.length,
          score: layer.score,
          order: layer.order,
          sampleId: sample.id,
        }));

        await tx.layer.createMany({
          data: layersData,
        });
      }

      // Calcular e atualizar escore médio da avaliação
      const averageScore = calculateEvaluationAverageScore(sampleScores);

      const updatedEvaluation = await tx.evaluation.update({
        where: { id: evaluation.id },
        data: { averageScore },
        include: {
          samples: {
            include: {
              layers: {
                orderBy: { order: "asc" },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedEvaluation;
    });
  }

  static async getEvaluations(userId: string, query: PaginationQuery) {
    const page = Math.max(1, query.page || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      query.limit || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;

    const [evaluations, total] = await Promise.all([
      prisma.evaluation.findMany({
        where: { userId },
        include: {
          samples: {
            include: {
              layers: {
                orderBy: { order: "asc" },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: query.sortOrder || "desc",
        },
        skip,
        take: limit,
      }),
      prisma.evaluation.count({
        where: { userId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      evaluations,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getEvaluationById(userId: string, evaluationId: string) {
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        userId,
      },
      include: {
        samples: {
          include: {
            layers: {
              orderBy: { order: "asc" },
            },
            photos: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!evaluation) {
      const error = new Error("Avaliação não encontrada") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    return evaluation;
  }

  static async updateEvaluation(
    userId: string,
    evaluationId: string,
    updateData: Partial<EvaluationData>
  ) {
    // Verificar se a avaliação existe e pertence ao usuário
    const existingEvaluation = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        userId,
      },
    });

    if (!existingEvaluation) {
      const error = new Error("Avaliação não encontrada") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Atualizar avaliação
    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        name: updateData.name,
        endTime: updateData.endTime,
        managementDescription: updateData.managementDescription,
      },
      include: {
        samples: {
          include: {
            layers: {
              orderBy: { order: "asc" },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedEvaluation;
  }

  static async deleteEvaluation(userId: string, evaluationId: string) {
    // Verificar se a avaliação existe e pertence ao usuário
    const existingEvaluation = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        userId,
      },
    });

    if (!existingEvaluation) {
      const error = new Error("Avaliação não encontrada") as CustomError;
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Deletar avaliação (cascata vai deletar amostras e camadas)
    await prisma.evaluation.delete({
      where: { id: evaluationId },
    });

    return { message: "Avaliação deletada com sucesso" };
  }

  static async getEvaluationStats(userId: string): Promise<EvaluationStats> {
    // Total de avaliações
    const totalEvaluations = await prisma.evaluation.count({
      where: { userId },
    });

    // Total de amostras
    const totalSamples = await prisma.sample.count({
      where: {
        evaluation: {
          userId,
        },
      },
    });

    // Escore médio geral
    const evaluations = await prisma.evaluation.findMany({
      where: { userId },
      select: { averageScore: true },
    });

    const averageScore =
      evaluations.length > 0
        ? Number(
            (
              evaluations.reduce((sum, eval) => sum + eval.averageScore, 0) /
              evaluations.length
            ).toFixed(1)
          )
        : 0;

    // Distribuição de escores
    const scoreDistribution = {
      excellent: 0,
      reasonable: 0,
      poor: 0,
    };

    evaluations.forEach((evaluation) => {
      const category = categorizeScore(evaluation.averageScore);
      scoreDistribution[category]++;
    });

    // Última avaliação
    const lastEvaluation = await prisma.evaluation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        date: true,
        name: true,
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
      averageScore,
      scoreDistribution,
      recentActivity: {
        lastEvaluation: lastEvaluation?.date,
        evaluationsThisMonth,
      },
    };
  }
}
