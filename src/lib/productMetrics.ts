import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Calcular métricas de popularidad para un producto específico
export async function calculateProductPopularity(productId: string) {
  try {
    console.log(`🔄 Calculando métricas de popularidad para producto: ${productId}`);
    
    // Obtener métricas del producto
    const metric = await prisma.popularityMetric.findUnique({
      where: { productId },
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
    
    if (!metric) {
      console.log(`⚠️ No se encontraron métricas para producto ${productId}, creando...`);
      return await createProductMetrics(productId);
    }
    
    if (!metric.product.isActive) {
      console.log(`⚠️ Producto ${productId} no está activo, saltando cálculo`);
      return { skipped: true, reason: 'product_inactive' };
    }
    
    // FÓRMULA DE POPULARIDAD (LÓGICA ANTERIOR):
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

    // Actualizar el score
    await prisma.popularityMetric.update({
      where: { id: metric.id },
      data: { 
        popularityScore: Math.round(popularityScore * 100) / 100,
        lastCalculated: new Date()
      }
    });
    
    console.log(`✅ Popularidad calculada para producto ${productId}: ${popularityScore.toFixed(2)}`);
    
    return {
      success: true,
      productId,
      popularityScore: Math.round(popularityScore * 100) / 100,
      metrics: {
        weeklyClicks: metric.weeklyClicks,
        monthlyClicks: metric.monthlyClicks,
        whatsappClicks: metric.whatsappClicks,
        favoriteClicks: metric.favoriteClicks,
        totalClicks: metric.totalClicks
      }
    };
    
  } catch (error) {
    console.error(`❌ Error calculando popularidad para producto ${productId}:`, error);
    throw error;
  }
}

// Calcular métricas de destacado para un producto específico
export async function calculateProductFeatured(productId: string) {
  try {
    console.log(`⭐ Calculando métricas de destacado para producto: ${productId}`);
    
    // Obtener métricas del producto
    const metric = await prisma.popularityMetric.findUnique({
      where: { productId },
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
    
    if (!metric) {
      console.log(`⚠️ No se encontraron métricas para producto ${productId}, creando...`);
      return await createProductMetrics(productId);
    }
    
    if (!metric.product.isActive) {
      console.log(`⚠️ Producto ${productId} no está activo, saltando cálculo`);
      return { skipped: true, reason: 'product_inactive' };
    }
    
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

    // Actualizar el score
    await prisma.popularityMetric.update({
      where: { id: metric.id },
      data: { 
        featuredScore: Math.round(featuredScore * 100) / 100
      }
    });
    
    console.log(`✅ Score destacado calculado para producto ${productId}: ${featuredScore.toFixed(2)}`);
    
    return {
      success: true,
      productId,
      featuredScore: Math.round(featuredScore * 100) / 100,
      metrics: {
        whatsappClicks: metric.whatsappClicks,
        favoriteClicks: metric.favoriteClicks,
        weeklyClicks: metric.weeklyClicks,
        monthlyClicks: metric.monthlyClicks
      }
    };
    
  } catch (error) {
    console.error(`❌ Error calculando destacado para producto ${productId}:`, error);
    throw error;
  }
}

// Actualizar clasificación de un producto específico
export async function updateProductClassification(productId: string) {
  try {
    console.log(`🏷️ Actualizando clasificación para producto: ${productId}`);
    
    // Obtener métricas del producto
    const metric = await prisma.popularityMetric.findUnique({
      where: { productId },
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
    
    if (!metric) {
      console.log(`⚠️ No se encontraron métricas para producto ${productId}`);
      return { skipped: true, reason: 'no_metrics' };
    }
    
    if (!metric.product.isActive) {
      console.log(`⚠️ Producto ${productId} no está activo, saltando clasificación`);
      return { skipped: true, reason: 'product_inactive' };
    }
    
    // Obtener todos los productos activos para calcular percentiles
    const allActiveMetrics = await prisma.popularityMetric.findMany({
      where: {
        product: { isActive: true }
      },
      select: {
        id: true,
        popularityScore: true,
        featuredScore: true
      },
      orderBy: [
        { popularityScore: 'desc' },
        { featuredScore: 'desc' }
      ]
    });
    
    if (allActiveMetrics.length === 0) {
      console.log(`⚠️ No hay métricas activas para clasificar`);
      return { skipped: true, reason: 'no_active_metrics' };
    }
    
    // Calcular percentiles
    const totalProducts = allActiveMetrics.length;
    const topPopularPercentile = Math.ceil(totalProducts * 0.20); // Top 20% populares
    const topFeaturedPercentile = Math.ceil(totalProducts * 0.15); // Top 15% destacados
    
    // Encontrar posición del producto actual
    const currentPopularRank = allActiveMetrics.findIndex(m => m.id === metric.id) + 1;
    const currentFeaturedRank = allActiveMetrics.findIndex(m => m.id === metric.id) + 1;
    
    // Determinar clasificaciones
    const isPopular = currentPopularRank <= topPopularPercentile;
    const isFeatured = currentFeaturedRank <= topFeaturedPercentile;
    
    // Actualizar clasificaciones
    await prisma.popularityMetric.update({
      where: { id: metric.id },
      data: {
        isPopular,
        isFeatured
      }
    });
    
    console.log(`✅ Clasificación actualizada para producto ${productId}:`, {
      popular: isPopular,
      featured: isFeatured,
      popularRank: currentPopularRank,
      featuredRank: currentFeaturedRank,
      totalProducts
    });
    
    return {
      success: true,
      productId,
      classification: {
        isPopular,
        isFeatured,
        popularRank: currentPopularRank,
        featuredRank: currentFeaturedRank,
        totalProducts
      }
    };
    
  } catch (error) {
    console.error(`❌ Error clasificando producto ${productId}:`, error);
    throw error;
  }
}

// Crear métricas iniciales para un producto
async function createProductMetrics(productId: string) {
  try {
    console.log(`📝 Creando métricas iniciales para producto: ${productId}`);
    
    const metric = await prisma.popularityMetric.create({
      data: {
        productId,
        totalClicks: 0,
        weeklyClicks: 0,
        monthlyClicks: 0,
        yearlyClicks: 0,
        viewClicks: 0,
        whatsappClicks: 0,
        favoriteClicks: 0,
        popularityScore: 0,
        featuredScore: 0,
        isPopular: false,
        isFeatured: false,
        lastCalculated: new Date()
      }
    });
    
    console.log(`✅ Métricas iniciales creadas para producto ${productId}`);
    return metric;
    
  } catch (error) {
    console.error(`❌ Error creando métricas para producto ${productId}:`, error);
    throw error;
  }
}

// Obtener métricas de un producto específico
export async function getProductMetrics(productId: string) {
  try {
    const metric = await prisma.popularityMetric.findUnique({
      where: { productId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            isActive: true
          }
        }
      }
    });
    
    if (!metric) {
      return null;
    }
    
    return {
      ...metric,
      product: metric.product
    };
    
  } catch (error) {
    console.error(`❌ Error obteniendo métricas para producto ${productId}:`, error);
    throw error;
  }
}

// Obtener ranking de productos
export async function getProductRankings(limit: number = 10, category?: string) {
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
    
    const [popularProducts, featuredProducts] = await Promise.all([
      // Productos populares
      prisma.popularityMetric.findMany({
        where: { ...where, isPopular: true },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true,
              images: {
                select: {
                  id: true,
                  altText: true,
                  isMain: true
                },
                where: { isMain: true },
                take: 1
              }
            }
          }
        },
        orderBy: { popularityScore: 'desc' },
        take: limit
      }),
      
      // Productos destacados
      prisma.popularityMetric.findMany({
        where: { ...where, isFeatured: true },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true,
              images: {
                select: {
                  id: true,
                  altText: true,
                  isMain: true
                },
                where: { isMain: true },
                take: 1
              }
            }
          }
        },
        orderBy: { featuredScore: 'desc' },
        take: limit
      })
    ]);
    
    return {
      popular: popularProducts,
      featured: featuredProducts
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo rankings:', error);
    throw error;
  }
} 