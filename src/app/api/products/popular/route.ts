import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener productos populares basados en métricas reales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const category = searchParams.get('category');

    // Construir filtros
    const where: any = {
      isActive: true,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    // Obtener productos con métricas de popularidad
    const popularProducts = await prisma.product.findMany({
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
        // Primero por score de popularidad (si existe)
        { popularity: { popularityScore: 'desc' } },
        // Luego por productos destacados
        { featured: 'desc' },
        // Finalmente por fecha de creación
        { createdAt: 'desc' }
      ],
      take: limit
    });

    // Si no hay productos con métricas, usar productos destacados
    if (popularProducts.length === 0) {
      const featuredProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          featured: true
        },
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
          creator: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return NextResponse.json(featuredProducts);
    }

    // Transformar productos para incluir URLs de imagen
    const transformedProducts = popularProducts.map(product => ({
      ...product,
      images: product.images.map(image => ({
        ...image,
        url: `/api/images/${image.id}`
      }))
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos populares' },
      { status: 500 }
    );
  }
} 