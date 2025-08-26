import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCategoryConfig } from '@/lib/categoryConfig';

const prisma = new PrismaClient();

// GET - Obtener todas las categorías (predefinidas + personalizadas)
export async function GET() {
  try {
    // Obtener categorías predefinidas de productos activos
    const predefinedCategories = await prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true
      },
      _count: {
        category: true
      }
    });

    // Obtener categorías personalizadas de la base de datos
    const customCategories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Mapear categorías predefinidas
    const mappedPredefined = predefinedCategories.map((cat) => {
      const categoryConfig = getCategoryConfig(cat.category);
      return {
        id: cat.category,
        name: categoryConfig.name,
        slug: cat.category,
        icon: categoryConfig.icon,
        description: categoryConfig.description,
        productCount: cat._count.category,
        isActive: true,
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    // Mapear categorías personalizadas
    const mappedCustom = customCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description || '',
      productCount: cat._count.products,
      isActive: cat.isActive,
      isCustom: true,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString()
    }));

    // Combinar y ordenar todas las categorías
    const allCategories = [...mappedPredefined, ...mappedCustom];
    allCategories.sort((a, b) => a.name.localeCompare(b.name));

    // Calcular total de productos
    const totalProducts = await prisma.product.count({
      where: { isActive: true }
    });

    return NextResponse.json({
      categories: allCategories,
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

// POST - Crear nueva categoría personalizada
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

    const data = await request.json();
    const { name, slug, icon, description, isActive } = data;

    // Validaciones
    if (!name || !slug || !icon) {
      return NextResponse.json(
        { error: 'Nombre, slug e icono son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una categoría con ese slug (predefinida o personalizada)
    const existingPredefined = await prisma.product.groupBy({
      by: ['category'],
      where: { category: slug }
    });

    const existingCustom = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingPredefined.length > 0 || existingCustom) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 409 }
      );
    }

    // Crear la categoría personalizada en la base de datos
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        icon,
        description: description || '',
        isActive: isActive !== false,
        isCustom: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Categoría creada exitosamente',
      category: {
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
        icon: newCategory.icon,
        description: newCategory.description,
        isActive: newCategory.isActive,
        isCustom: true,
        productCount: 0,
        createdAt: newCategory.createdAt.toISOString(),
        updatedAt: newCategory.updatedAt.toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    );
  }
} 