import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener productos populares
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // week, month, year, all
    const limit = parseInt(searchParams.get('limit') || '6');

    let orderBy: any = { popularityScore: 'desc' };

    // Cambiar el ordenamiento según el período
    switch (period) {
      case 'week':
        orderBy = { weeklyClicks: 'desc' };
        break;
      case 'month':
        orderBy = { monthlyClicks: 'desc' };
        break;
      case 'year':
        orderBy = { yearlyClicks: 'desc' };
        break;
      case 'all':
        orderBy = { totalClicks: 'desc' };
        break;
      default:
        orderBy = { popularityScore: 'desc' };
    }

    const popularProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        popularity: {
          isNot: null
        }
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        popularity: true,
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: {
        popularity: orderBy
      },
      take: limit
    });

    // Si no hay productos con métricas, devolver productos destacados
    if (popularProducts.length === 0) {
      const featuredProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          featured: true
        },
        include: {
          images: {
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

    return NextResponse.json(popularProducts);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos populares' },
      { status: 500 }
    );
  }
} 