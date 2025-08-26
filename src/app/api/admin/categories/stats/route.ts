import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCategoryConfig } from '@/lib/categoryConfig';

const prisma = new PrismaClient();

// GET - Obtener estadísticas detalladas de categorías
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Calcular fechas según el período
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 1, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Obtener estadísticas de categorías predefinidas
    const predefinedStats = await prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true,
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        category: true
      },
      _sum: {
        price: true
      }
    });

    // Obtener estadísticas de categorías personalizadas
    const customStats = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        },
        products: {
          where: {
            isActive: true,
            createdAt: {
              gte: startDate
            }
          },
          select: {
            price: true,
            featured: true
          }
        }
      }
    });

    // Calcular métricas para categorías predefinidas
    const predefinedCategories = predefinedStats.map((cat) => {
      const categoryConfig = getCategoryConfig(cat.category);
      const totalValue = cat._sum.price || 0;
      const productCount = cat._count.category;
      
      return {
        id: cat.category,
        name: categoryConfig.name,
        slug: cat.category,
        icon: categoryConfig.icon,
        description: categoryConfig.description,
        productCount,
        totalValue,
        averagePrice: productCount > 0 ? totalValue / productCount : 0,
        featuredCount: 0, // Se calculará por separado
        isCustom: false
      };
    });

    // Calcular métricas para categorías personalizadas
    const customCategories = customStats.map((cat) => {
      const totalValue = cat.products.reduce((sum, p) => sum + p.price, 0);
      const productCount = cat._count.products;
      const featuredCount = cat.products.filter(p => p.featured).length;
      
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description || '',
        productCount,
        totalValue,
        averagePrice: productCount > 0 ? totalValue / productCount : 0,
        featuredCount,
        isCustom: true
      };
    });

    // Combinar todas las categorías
    const allCategories = [...predefinedCategories, ...customCategories];

    // Calcular estadísticas generales
    const totalProducts = allCategories.reduce((sum, cat) => sum + cat.productCount, 0);
    const totalValue = allCategories.reduce((sum, cat) => sum + cat.totalValue, 0);
    const totalFeatured = allCategories.reduce((sum, cat) => sum + cat.featuredCount, 0);

    // Calcular crecimiento (comparar con período anterior)
    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    
    const previousStats = await prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true,
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      },
      _count: {
        category: true
      }
    });

    const previousTotal = previousStats.reduce((sum, cat) => sum + cat._count.category, 0);
    const growthRate = previousTotal > 0 ? ((totalProducts - previousTotal) / previousTotal) * 100 : 0;

    // Top categorías por número de productos
    const topCategories = [...allCategories]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5);

    // Categorías con productos más caros
    const expensiveCategories = [...allCategories]
      .filter(cat => cat.averagePrice > 0)
      .sort((a, b) => b.averagePrice - a.averagePrice)
      .slice(0, 5);

    // Productos destacados por categoría
    const featuredByCategory = allCategories
      .filter(cat => cat.featuredCount > 0)
      .sort((a, b) => b.featuredCount - a.featuredCount)
      .slice(0, 6);

    return NextResponse.json({
      period,
      general: {
        totalCategories: allCategories.length,
        totalProducts,
        totalValue,
        totalFeatured,
        growthRate: Math.round(growthRate * 100) / 100
      },
      topCategories,
      expensiveCategories,
      featuredByCategory,
      categories: allCategories
    });

  } catch (error) {
    console.error('Error fetching category stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de categorías' },
      { status: 500 }
    );
  }
} 