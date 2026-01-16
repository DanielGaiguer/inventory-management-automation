import { PrismaClient, MovementType } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Iniciando testes do schema...')

  // 1️⃣ Criar um item
  const item = await prisma.item.create({
    data: {
      name: 'Teclado Mecânico',
      category: 'Periféricos',
      quantity: 100,
      currentStock: 100,
      minStock: 10,
    },
  })

  console.log('✅ Item criado:', item)

  // 2️⃣ Registrar uma ENTRADA
  const entryMovement = await prisma.movement.create({
    data: {
      itemId: item.id,
      responsible: 'João Silva',
      type: MovementType.ENTRY,
      quantity: 50,
    },
  })

  console.log('📥 Movimento de entrada:', entryMovement)

  // Atualizar estoque
  await prisma.item.update({
    where: { id: item.id },
    data: {
      currentStock: { increment: 50 },
    },
  })

  // 3️⃣ Registrar uma SAÍDA
  const exitMovement = await prisma.movement.create({
    data: {
      itemId: item.id,
      responsible: 'Maria Souza',
      type: MovementType.EXIT,
      quantity: 30,
    },
  })

  console.log('📤 Movimento de saída:', exitMovement)

  // Atualizar estoque
  await prisma.item.update({
    where: { id: item.id },
    data: {
      currentStock: { decrement: 30 },
    },
  })

  // 4️⃣ Buscar item com movimentos
  const itemWithMovements = await prisma.item.findUnique({
    where: { id: item.id },
    include: {
      movements: true,
    },
  })

  console.log('📦 Item com movimentos:')
  console.dir(itemWithMovements, { depth: null })

  // 5️⃣ Buscar apenas saídas
  const exits = await prisma.movement.findMany({
    where: {
      itemId: item.id,
      type: MovementType.EXIT,
    },
  })

  console.log('📊 Movimentos de saída:', exits)

  // 6️⃣ Verificar estoque mínimo
  if (
    itemWithMovements &&
    itemWithMovements.minStock !== null &&
    itemWithMovements.currentStock <= itemWithMovements.minStock
  ) {
    console.warn('⚠️ Estoque abaixo do mínimo!')
  } else {
    console.log('✅ Estoque OK')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro no teste:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Prisma desconectado')
  })
