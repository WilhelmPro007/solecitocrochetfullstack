import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todas las imágenes de categorías
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.categoryImage.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        altText: true,
        order: true
      },
      orderBy: { order: 'asc' }
    });

    // Transformar para incluir la URL de la imagen
    const categoriesWithUrls = categories.map(category => ({
      ...category,
      imageUrl: `/api/images/${category.id}`
    }));

    return NextResponse.json(categoriesWithUrls);

  } catch (error) {
    console.error('Error fetching category images:', error);
    return NextResponse.json(
      { error: 'Error al obtener imágenes de categorías' },
      { status: 500 }
    );
  }
} 