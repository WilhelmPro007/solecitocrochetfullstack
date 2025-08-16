import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');

    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (active !== null) {
      where.isActive = active === 'true';
    }
    
    if (featured !== null) {
      where.featured = featured === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
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

    // Crear el producto
    const product = await prisma.product.create({
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
        createdBy: session.user.id,
        images: {
          create: images?.map((img: any, index: number) => ({
            url: img.url,
            altText: img.altText || name,
            isMain: index === 0,
            order: index
          })) || []
        }
      },
      include: {
        images: true,
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
} 