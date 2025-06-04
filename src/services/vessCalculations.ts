// src/services/vessCalculations.ts
import { LayerData } from "../types";
import { MANAGEMENT_DECISIONS } from "../utils/constants";

export const calculateSampleScore = (layers: LayerData[]): number => {
  if (layers.length === 0) return 0;

  const totalLength = layers.reduce((sum, layer) => sum + layer.length, 0);
  if (totalLength === 0) return 0;

  const weightedSum = layers.reduce(
    (sum, layer) => sum + layer.score * layer.length,
    0
  );
  return Number((weightedSum / totalLength).toFixed(1));
};

export const calculateEvaluationAverageScore = (
  sampleScores: number[]
): number => {
  if (sampleScores.length === 0) return 0;

  const totalScore = sampleScores.reduce((sum, score) => sum + score, 0);
  return Number((totalScore / sampleScores.length).toFixed(1));
};

export const getManagementDecision = (score: number): string => {
  if (score >= 1 && score < 3) {
    return MANAGEMENT_DECISIONS.good;
  } else if (score >= 3 && score < 4) {
    return MANAGEMENT_DECISIONS.reasonable;
  } else if (score >= 4) {
    return MANAGEMENT_DECISIONS.poor;
  }
  return "";
};

export const categorizeScore = (
  score: number
): "excellent" | "reasonable" | "poor" => {
  if (score >= 1 && score < 3) return "excellent";
  if (score >= 3 && score < 4) return "reasonable";
  return "poor";
};

export const generateEvaluationSummary = (evaluation: any): string => {
  const totalSamples = evaluation.samples.length;
  const startTime = evaluation.startTime;
  const endTime =
    evaluation.endTime ||
    new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return `${totalSamples} amostras\nAvaliador: ${evaluation.user.name}\nData das avaliações: ${evaluation.date}\nHora: ${startTime} - ${endTime}`;
};

export const validateVessScore = (score: number): boolean => {
  const validScores = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  return validScores.includes(score);
};

export const formatScoreForDisplay = (score: number): string => {
  return score.toString().replace(".", ",");
};
