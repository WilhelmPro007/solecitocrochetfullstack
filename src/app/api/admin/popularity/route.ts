import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { 
  recalculatePopularityScores, 
  resetPeriodicCounts, 
  cleanupOldTrackingData,
  getTopProducts 
} from '@/lib/popularity';

// GET - Obtener estadísticas de popularidad
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
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    switch (action) {
      case 'top-products':
        const topProducts = await getTopProducts(limit, category || undefined);
        return NextResponse.json(topProducts);
      
      case 'stats':
        // Obtener estadísticas generales
        const stats = await getPopularityStats();
        return NextResponse.json(stats);
      
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error getting popularity data:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de popularidad' },
      { status: 500 }
    );
  }
}

// POST - Ejecutar acciones de mantenimiento
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    const { action } = await request.json();

    switch (action) {
      case 'recalculate':
        const updated = await recalculatePopularityScores();
        return NextResponse.json({ 
          success: true, 
          message: `${updated} productos actualizados`,
          updated 
        });
      
      case 'reset-counters':
        const reset = await resetPeriodicCounts();
        return NextResponse.json({ 
          success: true, 
          message: 'Contadores reseteados',
          reset 
        });
      
      case 'cleanup':
        const cleaned = await cleanupOldTrackingData();
        return NextResponse.json({ 
          success: true, 
          message: `${cleaned} clicks antiguos eliminados`,
          cleaned 
        });
      
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error executing popularity action:', error);
    return NextResponse.json(
      { error: 'Error al ejecutar acción' },
      { status: 500 }
    );
  }
}

async function getPopularityStats() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Estadísticas generales
    const totalProducts = await prisma.product.count({ where: { isActive: true } });
    const totalClicks = await prisma.productClick.count();
    const totalFavorites = await prisma.productClick.count({ where: { clickType: 'favorite' } });
    const totalWhatsApp = await prisma.productClick.count({ where: { clickType: 'whatsapp' } });
    
    // Productos más populares
    const topProducts = await prisma.popularityMetric.findMany({
      take: 5,
      orderBy: { popularityScore: 'desc' },
      include: {
        product: {
          select: { name: true, category: true }
        }
      }
    });

    // Clicks por tipo
    const clicksByType = await prisma.productClick.groupBy({
      by: ['clickType'],
      _count: { clickType: true }
    });

    // Clicks por período
    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const weeklyClicks = await prisma.productClick.count({
      where: { createdAt: { gte: thisWeek } }
    });
    
    const monthlyClicks = await prisma.productClick.count({
      where: { createdAt: { gte: thisMonth } }
    });

    return {
      overview: {
        totalProducts,
        totalClicks,
        totalFavorites,
        totalWhatsApp
      },
      topProducts: topProducts.map(item => ({
        name: item.product.name,
        category: item.product.category,
        score: item.popularityScore,
        clicks: item.totalClicks
      })),
      clicksByType: clicksByType.map(item => ({
        type: item.clickType,
        count: item._count.clickType
      })),
      periods: {
        weekly: weeklyClicks,
        monthly: monthlyClicks
      }
    };

  } finally {
    await prisma.$disconnect();
  }
} 