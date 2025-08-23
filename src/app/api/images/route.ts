import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// POST - Subir nueva imagen
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'product' or 'category'
    const productId = formData.get('productId') as string;
    const categoryName = formData.get('categoryName') as string;
    const altText = formData.get('altText') as string;
    const isMain = formData.get('isMain') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no válido. Solo se permiten: JPEG, PNG, WebP' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === 'category') {
      // Manejar imagen de categoría
      if (!categoryName) {
        return NextResponse.json(
          { error: 'Nombre de categoría requerido' },
          { status: 400 }
        );
      }

      // Verificar si ya existe una imagen para esta categoría
      const existingImage = await prisma.categoryImage.findUnique({
        where: { name: categoryName }
      });

      if (existingImage) {
        // Actualizar imagen existente
        const updatedImage = await prisma.categoryImage.update({
          where: { name: categoryName },
          data: {
            imageData: buffer,
            mimeType: file.type,
            filename: file.name,
            fileSize: file.size,
            altText: altText || categoryName,
            updatedAt: new Date()
          }
        });

        return NextResponse.json({
          id: updatedImage.id,
          name: updatedImage.name,
          message: 'Imagen de categoría actualizada'
        });
      } else {
        // Crear nueva imagen de categoría
        const newImage = await prisma.categoryImage.create({
          data: {
            name: categoryName,
            imageData: buffer,
            mimeType: file.type,
            filename: file.name,
            fileSize: file.size,
            altText: altText || categoryName
          }
        });

        return NextResponse.json({
          id: newImage.id,
          name: newImage.name,
          message: 'Imagen de categoría creada'
        });
      }
    } else if (type === 'product') {
      // Manejar imagen de producto
      if (!productId) {
        return NextResponse.json(
          { error: 'ID del producto requerido' },
          { status: 400 }
        );
      }

      // Verificar que el producto existe
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true }
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }

      // Si es imagen principal, marcar otras como no principales
      if (isMain) {
        await prisma.productImage.updateMany({
          where: { productId: productId },
          data: { isMain: false }
        });
      }

      // Crear nueva imagen de producto
      const newImage = await prisma.productImage.create({
        data: {
          productId: productId,
          imageData: buffer,
          mimeType: file.type,
          filename: file.name,
          fileSize: file.size,
          altText: altText || product.name,
          isMain: isMain,
          order: product.images.length
        }
      });

      return NextResponse.json({
        id: newImage.id,
        productId: newImage.productId,
        message: 'Imagen de producto creada'
      });
    } else {
      return NextResponse.json(
        { error: 'Tipo de imagen no válido' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    );
  }
} 