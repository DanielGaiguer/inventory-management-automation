// Este arquivo ele garante que apenas 1 intancia do prisma client, ira ser instanciada no Next.
// Se voce nao tiver este codigo, a cada recompilação do Next ele vai abrir uma nova conexao com o banco
// Com este arquivo você garante que quando você recompilar esta aplicação, você não vai abrir multiplas conexões com seu banco de dados
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma =
  global.cachedPrisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = prisma
}

export const db = prisma
