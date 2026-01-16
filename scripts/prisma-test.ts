import { db } from "../src/_lib/prisma"

async function main() {
  const result = await db.$queryRaw`SELECT 1`
  console.log("Banco conectado:", result)
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
