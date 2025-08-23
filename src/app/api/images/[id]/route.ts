import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener imagen por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    // Buscar imagen de producto
    let image = await prisma.productImage.findUnique({
      where: { id },
      select: {
        imageData: true,
        mimeType: true,
        filename: true,
        altText: true
      }
    });

    // Si no se encuentra en productos, buscar en categorías
    if (!image) {
      const categoryImage = await prisma.categoryImage.findUnique({
        where: { id },
        select: {
          imageData: true,
          mimeType: true,
          filename: true,
          altText: true
        }
      });
      
      if (categoryImage) {
        image = categoryImage;
      }
    }

    if (!image || !image.imageData || !image.mimeType) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    // Crear respuesta con la imagen
    const response = new NextResponse(image.imageData, {
      status: 200,
      headers: {
        'Content-Type': image.mimeType,
        'Content-Disposition': `inline; filename="${image.filename || 'image'}"`,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache por 1 año
      }
    });

    return response;

  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Error al obtener imagen' },
      { status: 500 }
    );
  }
} 