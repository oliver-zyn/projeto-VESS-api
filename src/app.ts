// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import env from "./config/env";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// Configuração de segurança
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VESS API - Avaliação Visual da Estrutura do Solo",
    version: "1.0.0",
    documentation: "/api/health",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      evaluations: "/api/evaluations",
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
