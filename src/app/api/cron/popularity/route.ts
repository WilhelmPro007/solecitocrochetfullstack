import { NextRequest, NextResponse } from 'next/server';
import { dailyPopularityCalculation } from '@/lib/popularity';

// Endpoint para ejecutar desde cron job diariamente a medianoche UTC Nicaragua
export async function POST(request: NextRequest) {
  try {
    // Verificar que sea una llamada autorizada (puedes agregar un token secreto)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    console.log('🕛 Ejecutando cálculo diario de popularidad desde cron job...');
    
    // Ejecutar el cálculo diario
    await dailyPopularityCalculation();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cálculo diario de popularidad ejecutado correctamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error ejecutando cálculo diario:', error);
    return NextResponse.json(
      { error: 'Error ejecutando cálculo diario' },
      { status: 500 }
    );
  }
}

// GET para testing manual (solo en desarrollo)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Método no permitido en producción' },
      { status: 405 }
    );
  }

  try {
    console.log('🧪 Ejecutando cálculo diario de popularidad (testing)...');
    
    await dailyPopularityCalculation();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cálculo diario ejecutado (testing)',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en testing:', error);
    return NextResponse.json(
      { error: 'Error en testing' },
      { status: 500 }
    );
  }
} 