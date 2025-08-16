import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener productos populares (usando productos destacados por ahora)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');

    // Por ahora devolvemos productos destacados
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

    // Si no hay productos destacados, devolver los más recientes
    if (featuredProducts.length === 0) {
      const recentProducts = await prisma.product.findMany({
        where: {
          isActive: true
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

      return NextResponse.json(recentProducts);
    }

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos populares' },
      { status: 500 }
    );
  }
} 