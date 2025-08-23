#!/usr/bin/env node

/**
 * 🧪 Script de Testing para el Job Scheduler
 * 
 * Este script permite probar el sistema de job scheduling
 * sin necesidad de iniciar toda la aplicación Next.js
 */

const { PrismaClient } = require('@prisma/client');

// Configuración
const prisma = new PrismaClient();

// Función para simular clicks en productos
async function simulateProductClicks() {
  try {
    console.log('🎯 Simulando clicks en productos...');
    
    // Obtener productos activos
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      take: 5 // Solo los primeros 5 para testing
    });
    
    if (products.length === 0) {
      console.log('⚠️ No hay productos activos para simular clicks');
      return;
    }
    
    console.log(`📦 Productos encontrados: ${products.length}`);
    
    // Simular clicks para cada producto
    for (const product of products) {
      console.log(`🔄 Simulando clicks para: ${product.name}`);
      
      // Crear métricas si no existen
      let metric = await prisma.popularityMetric.findUnique({
        where: { productId: product.id }
      });
      
      if (!metric) {
        metric = await prisma.popularityMetric.create({
          data: {
            productId: product.id,
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
        console.log(`📝 Métricas creadas para: ${product.name}`);
      }
      
      // Simular clicks aleatorios
      const viewClicks = Math.floor(Math.random() * 50) + 10;
      const whatsappClicks = Math.floor(Math.random() * 20) + 5;
      const favoriteClicks = Math.floor(Math.random() * 15) + 3;
      
      // Actualizar métricas
      await prisma.popularityMetric.update({
        where: { id: metric.id },
        data: {
          totalClicks: { increment: viewClicks + whatsappClicks + favoriteClicks },
          weeklyClicks: { increment: Math.floor(viewClicks * 0.3) },
          monthlyClicks: { increment: Math.floor(viewClicks * 0.5) },
          viewClicks: { increment: viewClicks },
          whatsappClicks: { increment: whatsappClicks },
          favoriteClicks: { increment: favoriteClicks }
        }
      });
      
      console.log(`✅ Clicks simulados para ${product.name}:`, {
        view: viewClicks,
        whatsapp: whatsappClicks,
        favorite: favoriteClicks
      });
    }
    
    console.log('🎉 Simulación de clicks completada');
    
  } catch (error) {
    console.error('❌ Error simulando clicks:', error);
  }
}

// Función para mostrar métricas actuales
async function showCurrentMetrics() {
  try {
    console.log('📊 Mostrando métricas actuales...');
    
    const metrics = await prisma.popularityMetric.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      },
      orderBy: { popularityScore: 'desc' }
    });
    
    if (metrics.length === 0) {
      console.log('⚠️ No hay métricas disponibles');
      return;
    }
    
    console.log(`\n📈 Métricas de ${metrics.length} productos:`);
    console.log('─'.repeat(80));
    
    metrics.forEach((metric, index) => {
      console.log(`${index + 1}. ${metric.product.name} (${metric.product.category})`);
      console.log(`   📱 WhatsApp: ${metric.whatsappClicks} | ❤️ Favoritos: ${metric.favoriteClicks}`);
      console.log(`   👁️ Total: ${metric.totalClicks} | 🔥 Popularidad: ${metric.popularityScore.toFixed(2)}`);
      console.log(`   ⭐ Destacado: ${metric.featuredScore.toFixed(2)} | 🏷️ Popular: ${metric.isPopular ? 'Sí' : 'No'}`);
      console.log(`   🌟 Destacado: ${metric.isFeatured ? 'Sí' : 'No'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error mostrando métricas:', error);
  }
}

// Función para limpiar métricas (solo para testing)
async function clearTestMetrics() {
  try {
    console.log('🧹 Limpiando métricas de testing...');
    
    const result = await prisma.popularityMetric.deleteMany({
      where: {
        totalClicks: { gt: 0 }
      }
    });
    
    console.log(`✅ ${result.count} métricas eliminadas`);
    
  } catch (error) {
    console.error('❌ Error limpiando métricas:', error);
  }
}

// Función principal
async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'simulate':
        await simulateProductClicks();
        break;
      
      case 'show':
        await showCurrentMetrics();
        break;
      
      case 'clear':
        await clearTestMetrics();
        break;
      
      case 'help':
      default:
        console.log(`
🧪 Script de Testing para Job Scheduler

Uso: node test-scheduler.js [comando]

Comandos disponibles:
  simulate  - Simular clicks en productos para testing
  show      - Mostrar métricas actuales
  clear     - Limpiar métricas de testing (¡CUIDADO!)
  help      - Mostrar esta ayuda

Ejemplos:
  node test-scheduler.js simulate
  node test-scheduler.js show
  node test-scheduler.js clear
        `);
        break;
    }
    
  } catch (error) {
    console.error('❌ Error en el script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  simulateProductClicks,
  showCurrentMetrics,
  clearTestMetrics
}; 