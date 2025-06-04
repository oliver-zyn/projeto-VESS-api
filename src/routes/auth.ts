// src/routes/auth.ts
import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validateBody } from "../middleware/validation";
import { registerSchema, loginSchema } from "../utils/validators";

const router = Router();

// POST /api/auth/register
router.post("/register", validateBody(registerSchema), AuthController.register);

// POST /api/auth/login
router.post("/login", validateBody(loginSchema), AuthController.login);

// POST /api/auth/refresh
router.post("/refresh", AuthController.refreshToken);

// POST /api/auth/logout
router.post("/logout", AuthController.logout);

// POST /api/auth/verify
router.post("/verify", AuthController.verifyToken);

export default router;
