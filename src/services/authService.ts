// src/services/authService.ts
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import prisma from "../config/database";
import env from "../config/env";
import { CreateUserData, LoginData, TokenPayload } from "../types";
import { CustomError } from "../middleware/errorHandler";
import { HTTP_STATUS } from "../utils/constants";

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateTokens(userId: string, email: string) {
    const accessTokenPayload: TokenPayload = {
      userId,
      email,
      type: "access",
    };

    const refreshTokenPayload: TokenPayload = {
      userId,
      email,
      type: "refresh",
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    ) as string;

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    ) as string;

    return { accessToken, refreshToken };
  }

  static async register(userData: CreateUserData) {
    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      const error = new Error("Email já está em uso") as CustomError;
      error.statusCode = HTTP_STATUS.CONFLICT;
      throw error;
    }

    // Hash da senha
    const passwordHash = await this.hashPassword(userData.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        passwordHash,
        address: userData.address,
        country: userData.country || "Brasil",
        cityState: userData.cityState,
        language: userData.language || "Português (Brasil)",
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        country: true,
        cityState: true,
        language: true,
        createdAt: true,
      },
    });

    // Gerar tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user,
      ...tokens,
    };
  }

  static async login(loginData: LoginData) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      const error = new Error("Email ou senha inválidos") as CustomError;
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Verificar senha
    const isPasswordValid = await this.comparePassword(
      loginData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      const error = new Error("Email ou senha inválidos") as CustomError;
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Gerar tokens
    const tokens = this.generateTokens(user.id, user.email);

    // Retornar dados do usuário (sem senha)
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      ) as TokenPayload;

      if (decoded.type !== "refresh") {
        const error = new Error("Token de refresh inválido") as CustomError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        throw error;
      }

      // Verificar se o usuário ainda existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        const error = new Error("Usuário não encontrado") as CustomError;
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        throw error;
      }

      // Gerar novos tokens
      const tokens = this.generateTokens(user.id, user.email);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const customError = new Error(
          "Token de refresh expirado"
        ) as CustomError;
        customError.statusCode = HTTP_STATUS.UNAUTHORIZED;
        throw customError;
      }

      const customError = new Error("Token de refresh inválido") as CustomError;
      customError.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw customError;
    }
  }

  static async validateAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

      if (decoded.type !== "access") {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true },
      });

      return user;
    } catch {
      return null;
    }
  }
}
