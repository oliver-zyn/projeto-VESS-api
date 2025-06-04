// src/utils/constants.ts

export const VESS_SCORES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

export const MANAGEMENT_DECISIONS = {
  good: "Amostras com escores Qe-VESS de 1-2,9 indicam um solo com boa qualidade estrutural e não requerem mudanças no manejo.",
  reasonable:
    "Amostras com escores Qe-VESS de 3-3,9 indicam um solo com qualidade estrutural razoável que pode ser melhorado. Para maximizar a exploração do solo pelas raízes das culturas, as mudanças no manejo devem ser a longo prazo.",
  poor: "Amostras com escores Qe-VESS de 4-5 sugerem danos às funções do solo, comprometendo sua capacidade de suporte ao crescimento das culturas. Mudança de manejo deve ser a curto prazo.",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const JWT_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;
