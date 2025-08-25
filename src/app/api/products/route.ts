import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Obtener todos los productos con paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');
    
    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '16');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Validar parámetros de paginación
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Máximo 100 productos por página
    const offset = (validPage - 1) * validLimit;

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

    // Obtener el total de productos que coinciden con los filtros
    const totalProducts = await prisma.product.count({ where });
    
    // Calcular metadatos de paginación
    const totalPages = Math.ceil(totalProducts / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    // Construir ordenamiento
    let orderBy: any = {};
    switch (sortBy) {
      case 'price':
        orderBy.price = sortOrder;
        break;
      case 'name':
        orderBy.name = sortOrder;
        break;
      case 'createdAt':
      default:
        orderBy.createdAt = sortOrder;
        break;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            isMain: true,
            order: true,
            imageData: true
          },
          orderBy: { order: 'asc' }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy,
      skip: offset,
      take: validLimit
    });

    // Transformar productos para manejar imágenes BLOB
    const transformedProducts = products.map(product => ({
      ...product,
      images: product.images.map(image => ({
        id: image.id,
        url: image.imageData ? `/api/images/${image.id}` : image.url,
        altText: image.altText,
        isMain: image.isMain,
        order: image.order
      }))
    }));

    // Respuesta con metadatos de paginación
    const response = {
      products: transformedProducts,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalProducts,
        hasNextPage,
        hasPreviousPage,
        limit: validLimit,
        offset
      }
    };

    return NextResponse.json(response);
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