// vess-api/prisma/seed.ts (CORRIGIDO)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar usuário de exemplo com todos os campos
  const hashedPassword = await bcrypt.hash("123456", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@vess.com" },
    update: {
      // Atualizar dados existentes se usuário já existe
      name: "Usuário Demo",
      address: "Rua das Plantas, 123 - Centro",
      country: "Brasil",
      cityState: "Pato Branco - PR",
      language: "Português (Brasil)",
    },
    create: {
      email: "demo@vess.com",
      name: "Usuário Demo",
      passwordHash: hashedPassword,
      address: "Rua das Plantas, 123 - Centro", // ✅ Campo completo
      country: "Brasil", // ✅ Campo obrigatório
      cityState: "Pato Branco - PR", // ✅ Campo preenchido
      language: "Português (Brasil)", // ✅ Campo padrão
    },
  });

  console.log("👤 Usuário demo criado/atualizado:", {
    email: demoUser.email,
    name: demoUser.name,
    address: demoUser.address,
    country: demoUser.country,
    cityState: demoUser.cityState,
    language: demoUser.language,
  });

  // Criar avaliação de exemplo
  const demoEvaluation = await prisma.evaluation.create({
    data: {
      name: "Avaliação Demo - Campo Norte",
      date: "15/01/2024",
      startTime: "09:00",
      endTime: "11:30",
      averageScore: 3.2,
      managementDescription:
        "Solo com qualidade estrutural razoável. Recomenda-se rotação de culturas com sistema radicular abundante.",
      userId: demoUser.id,
      samples: {
        create: [
          {
            name: "Amostra 1",
            location: "-26.2285, -52.6769",
            otherInfo: "Solo argiloso, pós-colheita do milho",
            managementDecision: "Implementar rotação de culturas",
            sampleScore: 3.1,
            layers: {
              create: [
                { length: 8, score: 2, order: 1 },
                { length: 12, score: 3.5, order: 2 },
                { length: 5, score: 4, order: 3 },
              ],
            },
          },
          {
            name: "Amostra 2",
            location: "-26.2290, -52.6775",
            otherInfo: "Solo arenoso, área de pastagem",
            managementDecision: "Reduzir tráfego de máquinas pesadas",
            sampleScore: 3.3,
            layers: {
              create: [
                { length: 10, score: 3, order: 1 },
                { length: 15, score: 3.5, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("📊 Avaliação demo criada:", demoEvaluation.name);

  // Criar usuário adicional para teste
  const testUser = await prisma.user.upsert({
    where: { email: "teste@vess.com" },
    update: {},
    create: {
      email: "teste@vess.com",
      name: "João da Silva",
      passwordHash: await bcrypt.hash("123456", 12),
      address: "Av. Brasil, 456 - Jardim América",
      country: "Brasil",
      cityState: "Curitiba - PR",
      language: "Português (Brasil)",
    },
  });

  console.log("👤 Usuário teste criado:", {
    email: testUser.email,
    name: testUser.name,
    address: testUser.address,
    country: testUser.country,
    cityState: testUser.cityState,
  });

  console.log("\n✅ Seed completado com sucesso!");
  console.log("📧 Login demo: demo@vess.com");
  console.log("🔑 Senha demo: 123456");
  console.log("📧 Login teste: teste@vess.com");
  console.log("🔑 Senha teste: 123456");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
