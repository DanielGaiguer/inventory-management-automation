// Este é um arquivo de teste para validar o schema do Prisma
// Rode com: npx tsx scriptTest.ts

import { prisma } from "./src/_lib/prisma"

async function main() {
  // 1️⃣ Criar um item
  const item = await prisma.item.create({
    data: {
      name: "Resistor 10k 1/4W",
      category: "Eletrônicos",
      quantity: 100,
      currentStock: 100,
      minStock: 20,
    },
  })

  console.log("Item criado:", item)

  // 2️⃣ Criar uma movimentação de ENTRADA
  const entryMovement = await prisma.movement.create({
    data: {
      itemId: item.id,
      responsible: "Daniel",
      type: "ENTRY",
      quantity: 50,
    },
  })

  // Atualizar estoque
  await prisma.item.update({
    where: { id: item.id },
    data: {
      currentStock: {
        increment: entryMovement.quantity,
      },
    },
  })

  console.log("Movimentação de entrada criada:", entryMovement)

  // 3️⃣ Criar uma movimentação de SAÍDA
  const exitMovement = await prisma.movement.create({
    data: {
      itemId: item.id,
      responsible: "Daniel",
      type: "EXIT",
      quantity: 30,
    },
  })

  // Atualizar estoque
  await prisma.item.update({
    where: { id: item.id },
    data: {
      currentStock: {
        decrement: exitMovement.quantity,
      },
    },
  })

  console.log("Movimentação de saída criada:", exitMovement)

  // 4️⃣ Buscar item com histórico de movimentações
  const itemWithMovements = await prisma.item.findUnique({
    where: { id: item.id },
    include: {
      movements: true,
    },
  })

  console.log(
    "Item com movimentações:",
    JSON.stringify(itemWithMovements, null, 2)
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
