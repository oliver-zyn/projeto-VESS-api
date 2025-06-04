// src/types/index.ts

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LayerData {
  length: number;
  score: number;
  order: number;
}

export interface SampleData {
  name: string;
  location?: string;
  otherInfo?: string;
  managementDecision?: string;
  layers: LayerData[];
}

export interface EvaluationData {
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  managementDescription?: string;
  samples: SampleData[];
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  address?: string;
  country?: string;
  cityState?: string;
  language?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  address?: string;
  country?: string;
  cityState?: string;
  language?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EvaluationStats {
  totalEvaluations: number;
  totalSamples: number;
  averageScore: number;
  scoreDistribution: {
    excellent: number; // 1-2.9
    reasonable: number; // 3-3.9
    poor: number; // 4-5
  };
  recentActivity: {
    lastEvaluation?: string;
    evaluationsThisMonth: number;
  };
}