// src/routes/evaluation.ts
import { Router } from "express";
import { EvaluationController } from "../controllers/evaluationController";
import { authenticateToken } from "../middleware/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation";
import {
  evaluationSchema,
  updateEvaluationSchema,
  idSchema,
  paginationSchema,
} from "../utils/validators";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/evaluations/stats
router.get("/stats", EvaluationController.getStats);

// GET /api/evaluations
router.get(
  "/",
  validateQuery(paginationSchema),
  EvaluationController.getEvaluations
);

// POST /api/evaluations
router.post(
  "/",
  validateBody(evaluationSchema),
  EvaluationController.createEvaluation
);

// GET /api/evaluations/:id
router.get(
  "/:id",
  validateParams(idSchema),
  EvaluationController.getEvaluationById
);

// PUT /api/evaluations/:id
router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(updateEvaluationSchema),
  EvaluationController.updateEvaluation
);

// DELETE /api/evaluations/:id
router.delete(
  "/:id",
  validateParams(idSchema),
  EvaluationController.deleteEvaluation
);

export default router;
