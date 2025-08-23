import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener productos destacados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const category = searchParams.get('category');

    // Construir filtros
    const where: any = {
      isActive: true,
      featured: true, // Solo productos destacados
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    // Obtener productos destacados
    const featuredProducts = await prisma.product.findMany({
      where,
      include: {
        images: {
          select: {
            id: true,
            altText: true,
            isMain: true,
            order: true
          },
          orderBy: { order: 'asc' }
        },
        popularity: {
          select: {
            popularityScore: true,
            totalClicks: true,
            weeklyClicks: true,
            monthlyClicks: true
          }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        // Primero por fecha de creación (más recientes primero)
        { createdAt: 'desc' },
        // Luego por score de popularidad si existe
        { popularity: { popularityScore: 'desc' } }
      ],
      take: limit
    });

    // Transformar productos para incluir URLs de imagen
    const transformedProducts = featuredProducts.map(product => ({
      ...product,
      images: product.images.map(image => ({
        ...image,
        url: `/api/images/${image.id}`
      }))
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos destacados' },
      { status: 500 }
    );
  }
} 