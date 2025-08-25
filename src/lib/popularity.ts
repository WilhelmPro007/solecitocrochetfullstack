import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Función principal que se ejecuta diariamente a medianoche UTC Nicaragua
export async function dailyPopularityCalculation() {
  try {
    console.log('🕛 Iniciando cálculo diario de popularidad (UTC Nicaragua)...');
    
    // 1. Resetear contadores periódicos
    await resetPeriodicCounts();
    
    // 2. Calcular scores de popularidad (lógica anterior)
    await calculatePopularityScores();
    
    // 3. Calcular scores de productos destacados (nueva lógica)
    await calculateFeaturedScores();
    
    // 4. Clasificar productos automáticamente
    await classifyProducts();
    
    // 5. Limpiar datos antiguos (cada 7 días)
    const today = new Date();
    if (today.getUTCDay() === 0) { // Domingo
      await cleanupOldTrackingData();
    }
    
    console.log('✅ Cálculo diario de popularidad completado');
    
  } catch (error) {
    console.error('❌ Error en cálculo diario de popularidad:', error);
    throw error;
  }
}

// Calcular scores de popularidad (LÓGICA ANTERIOR)
export async function calculatePopularityScores() {
  try {
    console.log('🔄 Calculando scores de popularidad...');
    
    const metrics = await prisma.popularityMetric.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    });

    let updated = 0;
    
    for (const metric of metrics) {
      if (!metric.product.isActive) continue;
      
      // FÓRMULA ANTERIOR MANTENIDA:
      // - Clicks semanales: peso 0.4 (más reciente)
      // - Clicks mensuales: peso 0.3 (medio plazo)
      // - Clicks de WhatsApp: peso 2.0 (intención de compra alta)
      // - Clicks de favoritos: peso 1.5 (interés del usuario)
      // - Clicks totales: peso 0.1 (popularidad general)
      
      const popularityScore = 
        (metric.weeklyClicks * 0.4) + 
        (metric.monthlyClicks * 0.3) + 
        (metric.whatsappClicks * 2.0) + 
        (metric.favoriteClicks * 1.5) + 
        (metric.totalClicks * 0.1);

      await prisma.popularityMetric.update({
        where: { id: metric.id },
        data: { 
          popularityScore: Math.round(popularityScore * 100) / 100,
          lastCalculated: new Date()
        }
      });
      
      updated++;
    }
    
    console.log(`✅ Scores de popularidad calculados: ${updated} productos`);
    return updated;
    
  } catch (error) {
    console.error('❌ Error calculando popularidad:', error);
    throw error;
  }
}

// Calcular scores de productos destacados (NUEVA LÓGICA)
export async function calculateFeaturedScores() {
  try {
    console.log('⭐ Calculando scores de productos destacados...');
    
    const metrics = await prisma.popularityMetric.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    });

    let updated = 0;
    
    for (const metric of metrics) {
      if (!metric.product.isActive) continue;
      
      // NUEVA FÓRMULA PARA PRODUCTOS DESTACADOS:
      // - Clicks de WhatsApp: peso 3.0 (alta intención de compra)
      // - Clicks de favoritos: peso 1.0 (interés del usuario)
      // - Clicks semanales: peso 0.5 (relevancia reciente)
      // - Clicks mensuales: peso 0.3 (tendencia sostenida)
      
      const featuredScore = 
        (metric.whatsappClicks * 3.0) + 
        (metric.favoriteClicks * 1.0) + 
        (metric.weeklyClicks * 0.5) + 
        (metric.monthlyClicks * 0.3);

      await prisma.popularityMetric.update({
        where: { id: metric.id },
        data: { 
          featuredScore: Math.round(featuredScore * 100) / 100
        }
      });
      
      updated++;
    }
    
    console.log(`✅ Scores de productos destacados calculados: ${updated} productos`);
    return updated;
    
  } catch (error) {
    console.error('❌ Error calculando scores destacados:', error);
    throw error;
  }
}

// Clasificar productos automáticamente
export async function classifyProducts() {
  try {
    console.log('🏷️ Clasificando productos automáticamente...');
    
    // Obtener todos los productos activos con métricas
    const activeProducts = await prisma.popularityMetric.findMany({
      where: {
        product: { isActive: true }
      },
      orderBy: [
        { popularityScore: 'desc' },
        { featuredScore: 'desc' }
      ]
    });
    
    if (activeProducts.length === 0) return;
    
    // Calcular percentiles para clasificación
    const totalProducts = activeProducts.length;
    const topPopularPercentile = Math.ceil(totalProducts * 0.20); // Top 20% populares
    const topFeaturedPercentile = Math.ceil(totalProducts * 0.15); // Top 15% destacados
    
    // Resetear todas las clasificaciones
    await prisma.popularityMetric.updateMany({
      data: {
        isPopular: false,
        isFeatured: false
      }
    });
    
    // Marcar productos populares (top 20%)
    const popularProducts = activeProducts.slice(0, topPopularPercentile);
    for (const product of popularProducts) {
      await prisma.popularityMetric.update({
        where: { id: product.id },
        data: { isPopular: true }
      });
    }
    
    // Marcar productos destacados (top 15%)
    const featuredProducts = activeProducts.slice(0, topFeaturedPercentile);
    for (const product of featuredProducts) {
      await prisma.popularityMetric.update({
        where: { id: product.id },
        data: { isFeatured: true }
      });
    }
    
    console.log(`✅ Productos clasificados: ${popularProducts.length} populares, ${featuredProducts.length} destacados`);
    
  } catch (error) {
    console.error('❌ Error clasificando productos:', error);
    throw error;
  }
}

export async function resetPeriodicCounts() {
  try {
    console.log('🔄 Reseteando contadores periódicos...');
    
    const now = new Date();
    
    // Resetear contadores semanales si es una nueva semana
    const weeklyReset = await prisma.popularityMetric.updateMany({
      where: {
        OR: [
          { lastCalculated: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
          { weeklyClicks: { gt: 0 } }
        ]
      },
      data: { weeklyClicks: 0 }
    });
    
    // Resetear contadores mensuales si es un nuevo mes
    const monthlyReset = await prisma.popularityMetric.updateMany({
      where: {
        OR: [
          { lastCalculated: { lt: new Date(now.getFullYear(), now.getMonth(), 1) } },
          { monthlyClicks: { gt: 0 } }
        ]
      },
      data: { monthlyClicks: 0 }
    });
    
    // Resetear contadores anuales si es un nuevo año
    const yearlyReset = await prisma.popularityMetric.updateMany({
      where: {
        OR: [
          { lastCalculated: { lt: new Date(now.getFullYear(), 0, 1) } },
          { yearlyClicks: { gt: 0 } }
        ]
      },
      data: { yearlyClicks: 0 }
    });
    
    console.log(`✅ Contadores reseteados: Semanal: ${weeklyReset.count}, Mensual: ${monthlyReset.count}, Anual: ${yearlyReset.count}`);
    
    return {
      weekly: weeklyReset.count,
      monthly: monthlyReset.count,
      yearly: yearlyReset.count
    };
    
  } catch (error) {
    console.error('❌ Error reseteando contadores:', error);
    throw error;
  }
}

export async function getTopProducts(limit: number = 10, category?: string) {
  try {
    const where: any = {
      product: {
        isActive: true
      }
    };
    
    if (category && category !== 'all') {
      where.product = {
        ...where.product,
        category: category
      };
    }
    
    const topProducts = await prisma.popularityMetric.findMany({
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
            }
          }
        }
      },
      orderBy: [
        { popularityScore: 'desc' },
        { totalClicks: 'desc' },
        { weeklyClicks: 'desc' }
      ],
      take: limit
    });
    
    return topProducts;
    
  } catch (error) {
    console.error('❌ Error obteniendo productos top:', error);
    throw error;
  }
}

export async function getFeaturedProducts(limit: number = 10, category?: string) {
  try {
    const where: any = {
      product: {
        isActive: true
      },
      isFeatured: true
    };
    
    if (category && category !== 'all') {
      where.product = {
        ...where.product,
        category: category
      };
    }
    
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
            }
          }
        }
      },
      orderBy: [
        { featuredScore: 'desc' },
        { whatsappClicks: 'desc' },
        { favoriteClicks: 'desc' }
      ],
      take: limit
    });
    
    return featuredProducts;
    
  } catch (error) {
    console.error('❌ Error obteniendo productos destacados:', error);
    throw error;
  }
}

export async function cleanupOldTrackingData() {
  try {
    console.log('🧹 Limpiando datos de tracking antiguos...');
    
    // Eliminar clicks más antiguos de 1 año
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const deletedClicks = await prisma.productClick.deleteMany({
      where: {
        createdAt: { lt: oneYearAgo }
      }
    });
    
    console.log(`✅ Datos de tracking limpiados: ${deletedClicks.count} clicks eliminados`);
    return deletedClicks.count;
    
  } catch (error) {
    console.error('❌ Error limpiando datos de tracking:', error);
    throw error;
  }
}

// Función para ejecutar manualmente desde el dashboard
export async function recalculatePopularityScores() {
  try {
    console.log('🔄 Recalculando scores de popularidad manualmente...');
    
    await calculatePopularityScores();
    await calculateFeaturedScores();
    await classifyProducts();
    
    console.log('✅ Recalculación manual completada');
    
  } catch (error) {
    console.error('❌ Error en recálculo manual:', error);
    throw error;
  }
} 