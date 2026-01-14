import { NextResponse } from "next/server";
import { prisma } from "@/_lib/prisma";

export async function GET() {
  const items = await prisma.item.findMany();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();

  const item = await prisma.item.create({
    data: {
      name: body.name,
      quantity: body.quantity,
      category: body.category, // obrigatório
      currentStock: body.currentStock, // obrigatório
    },
  });

  return NextResponse.json(item);
}
