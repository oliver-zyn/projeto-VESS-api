// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import evaluationRoutes from "./evaluations";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "VESS API está funcionando!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/evaluations", evaluationRoutes);

export default router;
