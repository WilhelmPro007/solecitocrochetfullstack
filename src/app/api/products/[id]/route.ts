import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Obtener un producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin o superadmin
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
    const {
      name,
      description,
      price,
      category,
      stock,
      featured,
      materials,
      dimensions,
      weight,
      careInstructions,
      images
    } = data;

    // Actualizar el producto
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock) || 0,
        featured: Boolean(featured),
        materials,
        dimensions,
        weight,
        careInstructions,
      },
      include: {
        images: true,
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Si se enviaron imágenes, actualizarlas
    if (images && Array.isArray(images)) {
      // Eliminar imágenes existentes
      await prisma.productImage.deleteMany({
        where: { productId: id }
      });

      // Crear nuevas imágenes
      await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: id,
          url: img.url,
          altText: img.altText || name,
          isMain: index === 0,
          order: index
        }))
      });
    }

    // Obtener el producto actualizado con imágenes
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin o superadmin
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

    // Soft delete - solo marcar como inactivo
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: {
        images: true,
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
} 