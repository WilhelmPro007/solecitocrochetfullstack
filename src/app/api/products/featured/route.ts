import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener productos destacados basados en métricas de WhatsApp
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const category = searchParams.get('category');

    // Construir filtros
    const where: any = {
      product: {
        isActive: true,
      },
      isFeatured: true, // Solo productos marcados como destacados
    };

    if (category && category !== 'all') {
      where.product = {
        ...where.product,
        category: category
      };
    }

    // Obtener productos destacados con métricas
    const featuredProducts = await prisma.popularityMetric.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            featured: true,
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
          }
        }
      },
      orderBy: [
        // Primero por score de destacado
        { featuredScore: 'desc' },
        // Luego por clicks de WhatsApp
        { whatsappClicks: 'desc' },
        // Finalmente por clicks de favoritos
        { favoriteClicks: 'desc' }
      ],
      take: limit
    });

    // Si no hay productos destacados automáticos, usar productos marcados manualmente
    if (featuredProducts.length === 0) {
      const manualFeatured = await prisma.product.findMany({
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

      return NextResponse.json(manualFeatured);
    }

    // Transformar productos para incluir URLs de imagen
    const transformedProducts = featuredProducts.map(item => ({
      ...item.product,
      popularity: {
        featuredScore: item.featuredScore,
        whatsappClicks: item.whatsappClicks,
        favoriteClicks: item.favoriteClicks,
        totalClicks: item.totalClicks
      },
      images: item.product.images.map(image => ({
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