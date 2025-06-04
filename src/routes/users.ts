// src/routes/users.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { updateUserSchema } from "../utils/validators";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/users/profile
router.get("/profile", UserController.getProfile);

// PUT /api/users/profile
router.put(
  "/profile",
  validateBody(updateUserSchema),
  UserController.updateProfile
);

// DELETE /api/users/account
router.delete("/account", UserController.deleteAccount);

// GET /api/users/stats
router.get("/stats", UserController.getStats);

export default router;
