// src/server.ts
import app from "./app";
import env from "./config/env";
import prisma from "./config/database";

const PORT = env.PORT;

async function startServer() {
  try {
    // Testar conexão com o banco
    await prisma.$connect();
    console.log("✅ Conectado ao banco de dados PostgreSQL");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor VESS API rodando na porta ${PORT}`);
      console.log(`📱 Ambiente: ${env.NODE_ENV}`);
      console.log(`🌍 CORS configurado para: ${env.CORS_ORIGIN}`);
      console.log(`📊 API disponível em: http://localhost:${PORT}`);
      console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await prisma.$disconnect();
  console.log("✅ Desconectado do banco de dados");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await prisma.$disconnect();
  console.log("✅ Desconectado do banco de dados");
  process.exit(0);
});

startServer();
