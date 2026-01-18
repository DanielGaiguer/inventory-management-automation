import { PrismaClient, MovementType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpa dados antigos, 
  await prisma.movement.deleteMany();
  await prisma.item.deleteMany();

  // Cria itens
  await prisma.item.createMany({
    data: [
      { name: "Parafuso M6", category: "Ferramentas", quantity: 500, currentStock: 500, minStock: 50 },
      { name: "Martelo", category: "Ferramentas", quantity: 100, currentStock: 100, minStock: 10 },
      { name: "Tinta Vermelha 1L", category: "Materiais", quantity: 200, currentStock: 200, minStock: 20 },
    ],
  });

  const allItems = await prisma.item.findMany();

  const movementsData = [
    { itemId: allItems[0].id, responsible: "João", type: MovementType.ENTRY, quantity: 100 },
    { itemId: allItems[0].id, responsible: "Maria", type: MovementType.EXIT, quantity: 50 },
    { itemId: allItems[1].id, responsible: "Carlos", type: MovementType.ENTRY, quantity: 50 },
    { itemId: allItems[2].id, responsible: "Ana", type: MovementType.EXIT, quantity: 30 },
  ];

  for (const movement of movementsData) {
    await prisma.movement.create({ data: movement });
  }

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
