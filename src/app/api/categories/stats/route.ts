import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
    const period = searchParams.get('period') || 'month'; // month, week, year

    // Calcular fechas para el período
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Estadísticas generales
    const totalProducts = await prisma.product.count({ where: { isActive: true } });
    const totalCategories = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true }
    });

    // Productos por categoría con estadísticas
    const categoriesWithStats = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true
      },
      _sum: {
        price: true
      },
      _avg: {
        price: true
      }
    });

    // Productos destacados por categoría
    const featuredByCategory = await prisma.product.groupBy({
      by: ['category'],
      where: { 
        isActive: true,
        featured: true
      },
      _count: {
        category: true
      }
    });

    // Productos creados en el período
    const productsInPeriod = await prisma.product.count({
      where: {
        isActive: true,
        createdAt: { gte: startDate }
      }
    });

    // Categorías con más productos
    const topCategories = categoriesWithStats
      .sort((a, b) => b._count.category - a._count.category)
      .slice(0, 5);

    // Categorías con productos más caros
    const expensiveCategories = categoriesWithStats
      .filter(cat => cat._avg.price && cat._avg.price > 0)
      .sort((a, b) => (b._avg.price || 0) - (a._avg.price || 0))
      .slice(0, 5);

    // Categorías con productos más baratos
    const cheapCategories = categoriesWithStats
      .filter(cat => cat._avg.price && cat._avg.price > 0)
      .sort((a, b) => (a._avg.price || 0) - (b._avg.price || 0))
      .slice(0, 5);

    // Estadísticas de crecimiento
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousPeriodProducts = await prisma.product.count({
      where: {
        isActive: true,
        createdAt: { 
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    });

    const growthRate = previousPeriodProducts > 0 
      ? ((productsInPeriod - previousPeriodProducts) / previousPeriodProducts) * 100
      : 0;

    // Mapear categorías con configuración
    const mappedCategories = categoriesWithStats.map(cat => {
      const categoryConfig = getCategoryConfig(cat.category);
      const featuredCount = featuredByCategory.find(f => f.category === cat.category)?._count.category || 0;
      
      return {
        id: cat.category,
        name: categoryConfig.name,
        slug: cat.category,
        icon: categoryConfig.icon,
        description: categoryConfig.description,
        productCount: cat._count.category,
        totalValue: cat._sum.price || 0,
        averagePrice: cat._avg.price || 0,
        featuredCount,
        featuredPercentage: cat._count.category > 0 ? (featuredCount / cat._count.category) * 100 : 0
      };
    });

    // Ordenar por número de productos
    mappedCategories.sort((a, b) => b.productCount - a.productCount);

    return NextResponse.json({
      overview: {
        totalProducts,
        totalCategories: totalCategories.length,
        productsInPeriod,
        previousPeriodProducts,
        growthRate: Math.round(growthRate * 100) / 100,
        period
      },
      categories: mappedCategories,
      topCategories: topCategories.map(cat => {
        const categoryConfig = getCategoryConfig(cat.category);
        return {
          name: categoryConfig.name,
          icon: categoryConfig.icon,
          productCount: cat._count.category,
          totalValue: cat._sum.price || 0
        };
      }),
      expensiveCategories: expensiveCategories.map(cat => {
        const categoryConfig = getCategoryConfig(cat.category);
        return {
          name: categoryConfig.name,
          icon: categoryConfig.icon,
          averagePrice: cat._avg.price || 0,
          productCount: cat._count.category
        };
      }),
      cheapCategories: cheapCategories.map(cat => {
        const categoryConfig = getCategoryConfig(cat.category);
        return {
          name: categoryConfig.name,
          icon: categoryConfig.icon,
          averagePrice: cat._avg.price || 0,
          productCount: cat._count.category
        };
      }),
      featuredByCategory: featuredByCategory.map(cat => {
        const categoryConfig = getCategoryConfig(cat.category);
        return {
          name: categoryConfig.name,
          icon: categoryConfig.icon,
          featuredCount: cat._count.category
        };
      })
    });

  } catch (error) {
    console.error('Error getting category stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de categorías' },
      { status: 500 }
    );
  }
}

// Función para obtener configuración de categorías
function getCategoryConfig(categorySlug: string) {
  const categoryConfigs: { [key: string]: { name: string; icon: string; description: string } } = {
    'accesorios': { name: 'Accesorios', icon: '🧣', description: 'Gorros, bufandas, guantes y otros accesorios tejidos' },
    'bolsos': { name: 'Bolsos', icon: '👜', description: 'Bolsos, mochilas y carteras tejidas a mano' },
    'juguetes': { name: 'Juguetes', icon: '🧸', description: 'Juguetes tejidos y amigurumis para niños' },
    'bebe': { name: 'Bebé', icon: '👶', description: 'Ropa y accesorios especiales para bebés' },
    'hogar': { name: 'Hogar', icon: '🏠', description: 'Elementos decorativos y útiles para el hogar' },
    'ropa': { name: 'Ropa', icon: '👗', description: 'Prendas de vestir tejidas a mano' },
    'amigurumis': { name: 'Amigurumis', icon: '🐰', description: 'Muñecos tejidos con técnica amigurumi' },
    'mantas': { name: 'Mantas', icon: '🛏️', description: 'Mantas y cobijas tejidas a mano' },
    'toallas': { name: 'Toallas', icon: '🧺', description: 'Toallas y paños de cocina tejidos' },
    'decoracion': { name: 'Decoración', icon: '🏺', description: 'Elementos decorativos para el hogar' },
    'cojines': { name: 'Cojines', icon: '🪑', description: 'Cojines y almohadones tejidos' },
    'alfombras': { name: 'Alfombras', icon: '🟫', description: 'Alfombras y tapetes tejidos a mano' }
  };

  return categoryConfigs[categorySlug] || { 
    name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1), 
    icon: '🎀',
    description: 'Categoría personalizada'
  };
} 