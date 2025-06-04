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

      const result = await EvaluationService.getEvaluations(userId, query);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.evaluations,
        pagination: result.pagination,
      });
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
