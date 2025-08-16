import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Trackear click en producto
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { clickType = 'view' } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const referrer = request.headers.get('referer') || '';

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const week = Math.ceil(now.getDate() / 7);
    const day = now.getDate();
    const hour = now.getHours();

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Registrar el click
    await prisma.productClick.create({
      data: {
        productId: params.id,
        clickType,
        userAgent,
        ipAddress,
        referrer,
        year,
        month,
        week,
        day,
        hour
      }
    });

    // Actualizar o crear métricas de popularidad
    await prisma.popularityMetric.upsert({
      where: { productId: params.id },
      update: {
        totalClicks: { increment: 1 },
        weeklyClicks: { increment: 1 },
        monthlyClicks: { increment: 1 },
        yearlyClicks: { increment: 1 },
        viewClicks: clickType === 'view' ? { increment: 1 } : undefined,
        whatsappClicks: clickType === 'whatsapp' ? { increment: 1 } : undefined,
        favoriteClicks: clickType === 'favorite' ? { increment: 1 } : undefined,
        lastCalculated: now
      },
      create: {
        productId: params.id,
        totalClicks: 1,
        weeklyClicks: 1,
        monthlyClicks: 1,
        yearlyClicks: 1,
        viewClicks: clickType === 'view' ? 1 : 0,
        whatsappClicks: clickType === 'whatsapp' ? 1 : 0,
        favoriteClicks: clickType === 'favorite' ? 1 : 0,
        popularityScore: 1,
        lastCalculated: now
      }
    });

    // Calcular nuevo score de popularidad
    const metrics = await prisma.popularityMetric.findUnique({
      where: { productId: params.id }
    });

    if (metrics) {
      // Fórmula de popularidad: (clicks semanales * 0.5) + (clicks mensuales * 0.3) + (whatsapp * 2) + (favoritos * 1.5)
      const popularityScore = 
        (metrics.weeklyClicks * 0.5) + 
        (metrics.monthlyClicks * 0.3) + 
        (metrics.whatsappClicks * 2) + 
        (metrics.favoriteClicks * 1.5);

      await prisma.popularityMetric.update({
        where: { productId: params.id },
        data: { popularityScore }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Error al registrar click' },
      { status: 500 }
    );
  }
} 