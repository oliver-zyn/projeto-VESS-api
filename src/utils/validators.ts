// src/utils/validators.ts
import { z } from "zod";
import { VESS_SCORES } from "./constants";

// Auth validators
export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  address: z.string().optional(),
  country: z.string().default("Brasil"),
  cityState: z.string().optional(),
  language: z.string().default("Português (Brasil)"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// User validators
export const updateUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  cityState: z.string().optional(),
  language: z.string().optional(),
});

// Layer validators
export const layerSchema = z.object({
  length: z.number().positive("Comprimento deve ser positivo"),
  score: z
    .number()
    .refine(
      (val) => VESS_SCORES.includes(val as any),
      "Escore deve ser um valor VESS válido"
    ),
  order: z.number().int().positive("Ordem deve ser um número inteiro positivo"),
});

// Sample validators
export const sampleSchema = z.object({
  name: z.string().min(1, "Nome da amostra é obrigatório"),
  location: z.string().optional(),
  otherInfo: z.string().optional(),
  managementDecision: z.string().optional(),
  layers: z.array(layerSchema).min(1, "Pelo menos uma camada é obrigatória"),
});

// Evaluation validators
export const evaluationSchema = z.object({
  name: z.string().min(1, "Nome da avaliação é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  startTime: z.string().min(1, "Hora de início é obrigatória"),
  endTime: z.string().optional(),
  managementDescription: z.string().optional(),
  samples: z.array(sampleSchema).min(1, "Pelo menos uma amostra é obrigatória"),
});

export const updateEvaluationSchema = z.object({
  name: z.string().min(1, "Nome da avaliação é obrigatório").optional(),
  endTime: z.string().optional(),
  managementDescription: z.string().optional(),
});

// Query validators
export const paginationSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const idSchema = z.object({
  id: z.string().cuid("ID inválido"),
});
