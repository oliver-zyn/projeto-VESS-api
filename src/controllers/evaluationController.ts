// src/controllers/evaluationController.ts
import { Response } from "express";
import { EvaluationService } from "../services/evaluationService";
import { AuthRequest, EvaluationData, PaginationQuery } from "../types";
import { HTTP_STATUS } from "../utils/constants";
import { asyncHandler } from "../middleware/errorHandler";

export class EvaluationController {
  static createEvaluation = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const evaluationData: EvaluationData = req.body;

      const evaluation = await EvaluationService.createEvaluation(
        userId,
        evaluationData
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Avaliação criada com sucesso",
        data: evaluation,
      });
    }
  );

  static getEvaluations = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const query = req.query as unknown as PaginationQuery;

      console.log("📊 getEvaluations - userId:", userId); // Debug
      console.log("📊 getEvaluations - query:", query); // Debug

      try {
        const result = await EvaluationService.getEvaluations(userId, query);

        console.log("📊 getEvaluations - result:", {
          evaluationsCount: result.evaluations.length,
          pagination: result.pagination,
        }); // Debug

        // Mapear avaliações para incluir o nome do avaliador
        const mappedEvaluations = result.evaluations.map((evaluation) => ({
          ...evaluation,
          evaluator: evaluation.user?.name || "Avaliador desconhecido",
        }));

        console.log(
          "📊 getEvaluations - mapped first evaluation:",
          mappedEvaluations[0]
        ); // Debug

        res.status(HTTP_STATUS.OK).json({
          success: true,
          data: mappedEvaluations,
          pagination: result.pagination,
        });
      } catch (error) {
        console.error("❌ Erro em getEvaluations:", error); // Debug
        throw error;
      }
    }
  );

  static getEvaluationById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const { id } = req.params;

      const evaluation = await EvaluationService.getEvaluationById(userId, id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: evaluation,
      });
    }
  );

  static updateEvaluation = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const { id } = req.params;
      const updateData: Partial<EvaluationData> = req.body;

      const evaluation = await EvaluationService.updateEvaluation(
        userId,
        id,
        updateData
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Avaliação atualizada com sucesso",
        data: evaluation,
      });
    }
  );

  static deleteEvaluation = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const { id } = req.params;

      const result = await EvaluationService.deleteEvaluation(userId, id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message,
      });
    }
  );

  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    const stats = await EvaluationService.getEvaluationStats(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: stats,
    });
  });
}
