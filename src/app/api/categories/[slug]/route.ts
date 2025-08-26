import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCategoryConfig } from '@/lib/categoryConfig';

const prisma = new PrismaClient();

// GET - Obtener categoría específica por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug de categoría requerido' },
        { status: 400 }
      );
    }

    // Primero verificar si es una categoría personalizada
    const customCategory = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (customCategory) {
      // Es una categoría personalizada
      const products = await prisma.product.findMany({
        where: { 
          categoryId: customCategory.id,
          isActive: true 
        },
        select: {
          id: true,
          name: true,
          price: true,
          featured: true,
          images: {
            select: {
              id: true,
              isMain: true,
              order: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        category: {
          id: customCategory.id,
          name: customCategory.name,
          slug: customCategory.slug,
          icon: customCategory.icon,
          description: customCategory.description,
          productCount: customCategory._count.products,
          totalValue: products.reduce((sum, p) => sum + p.price, 0),
          isActive: customCategory.isActive,
          isCustom: true
        },
        products
      });
    }

    // Si no es personalizada, verificar si es predefinida
    const products = await prisma.product.findMany({
      where: { 
        category: slug,
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        price: true,
        featured: true,
        images: {
          select: {
            id: true,
            isMain: true,
            order: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    // Es una categoría predefinida
    const categoryConfig = getCategoryConfig(slug);
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    return NextResponse.json({
      category: {
        id: slug,
        name: categoryConfig.name,
        slug,
        icon: categoryConfig.icon,
        description: categoryConfig.description,
        productCount: products.length,
        totalValue,
        isActive: true,
        isCustom: false
      },
      products
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Error al obtener categoría' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar categoría
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;
    const data = await request.json();
    const { name, newSlug, icon, description, isActive } = data;

    // Validaciones
    if (!name || !icon) {
      return NextResponse.json(
        { error: 'Nombre e icono son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si es una categoría personalizada
    const customCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (customCategory) {
      // Actualizar categoría personalizada
      if (newSlug && newSlug !== slug) {
        // Verificar que el nuevo slug no exista
        const existingCategory = await prisma.category.findUnique({
          where: { slug: newSlug }
        });

        if (existingCategory) {
          return NextResponse.json(
            { error: 'Ya existe una categoría con ese slug' },
            { status: 409 }
          );
        }

        // Actualizar slug de la categoría
        await prisma.category.update({
          where: { id: customCategory.id },
          data: { slug: newSlug }
        });
      }

      // Actualizar otros campos
      const updatedCategory = await prisma.category.update({
        where: { id: customCategory.id },
        data: {
          name,
          icon,
          description,
          isActive: isActive !== false
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        category: {
          id: updatedCategory.id,
          name: updatedCategory.name,
          slug: updatedCategory.slug,
          icon: updatedCategory.icon,
          description: updatedCategory.description,
          isActive: updatedCategory.isActive
        }
      });
    } else {
      // Es una categoría predefinida - no se puede editar directamente
      return NextResponse.json(
        { error: 'No se pueden editar categorías predefinidas' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar categoría (solo categorías personalizadas)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;

    // Verificar si es una categoría personalizada
    const customCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (!customCategory) {
      return NextResponse.json(
        { error: 'No se pueden eliminar categorías predefinidas' },
        { status: 400 }
      );
    }

    // Verificar si hay productos en la categoría
    const productCount = await prisma.product.count({
      where: { 
        categoryId: customCategory.id,
        isActive: true 
      }
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar la categoría. Tiene ${productCount} producto(s) activo(s).` },
        { status: 400 }
      );
    }

    // Eliminar la categoría personalizada
    await prisma.category.delete({
      where: { id: customCategory.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    );
  }
} 