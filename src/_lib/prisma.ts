import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL || "file:./dev.db";

// Criar o adapter
const adapter = new PrismaBetterSqlite3({ url: connectionString });

// Criar uma instância de PrismaClient
// Evitar múltiplas instâncias em dev (hot reload)
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"], // log das queries
  });

// Salvar no global para hot reload em dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
