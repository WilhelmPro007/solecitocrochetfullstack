import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todas las categorías con contador de productos
export async function GET() {
  try {
    // Obtener el total de productos activos
    const totalProducts = await prisma.product.count({
      where: { isActive: true }
    });

    // Obtener categorías únicas de productos activos
    const categoriesWithCount = await prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true
      },
      _count: {
        category: true
      }
    });

    // Mapear a formato de categorías con iconos
    const categories = categoriesWithCount.map((cat) => {
      const categoryConfig = getCategoryConfig(cat.category);
      return {
        id: cat.category,
        name: categoryConfig.name,
        icon: categoryConfig.icon,
        productCount: cat._count.category
      };
    });

    // Ordenar por nombre
    categories.sort((a, b) => a.name.localeCompare(b.name));

    // Retornar con el total de productos
    return NextResponse.json({
      categories,
      totalProducts
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

// Función para obtener configuración de categorías
function getCategoryConfig(categorySlug: string) {
  const categoryConfigs: { [key: string]: { name: string; icon: string } } = {
    'accesorios': { name: 'Accesorios', icon: '🧣' },
    'bolsos': { name: 'Bolsos', icon: '👜' },
    'juguetes': { name: 'Juguetes', icon: '🧸' },
    'bebe': { name: 'Bebé', icon: '👶' },
    'hogar': { name: 'Hogar', icon: '🏠' },
    'ropa': { name: 'Ropa', icon: '👗' },
    'amigurumis': { name: 'Amigurumis', icon: '🐰' },
    'mantas': { name: 'Mantas', icon: '🛏️' },
    'toallas': { name: 'Toallas', icon: '🧺' },
    'decoracion': { name: 'Decoración', icon: '🏺' },
    'cojines': { name: 'Cojines', icon: '🪑' },
    'alfombras': { name: 'Alfombras', icon: '🟫' }
  };

  return categoryConfigs[categorySlug] || { 
    name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1), 
    icon: '🎀' 
  };
} 