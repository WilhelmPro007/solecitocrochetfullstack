import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { 
  scheduleAllProductJobs,
  scheduleProductJob,
  getQueueStats,
  cleanQueues,
  pauseAllQueues,
  resumeAllQueues,
  initializeJobScheduler,
  startProcessing,
  stopProcessing,
  executeDailyCalculation,
  getQueueJobs
} from '@/lib/simpleJobScheduler';

// GET - Obtener estadísticas de jobs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await getQueueStats();
        return NextResponse.json(stats);
      
      case 'status':
        // Obtener estado general del scheduler
        const status = {
          timestamp: new Date().toISOString(),
          scheduler: 'active',
          queues: await getQueueStats()
        };
        return NextResponse.json(status);
      
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error getting job data:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de jobs' },
      { status: 500 }
    );
  }
}

// POST - Ejecutar acciones del job scheduler
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
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    const { action, productId, type } = await request.json();

    switch (action) {
      case 'schedule-all':
        const allJobs = await scheduleAllProductJobs();
        return NextResponse.json({ 
          success: true, 
          message: `Jobs programados para ${allJobs.productsCount} productos`,
          result: allJobs
        });
      
      case 'schedule-product':
        if (!productId) {
          return NextResponse.json(
            { error: 'productId es requerido' },
            { status: 400 }
          );
        }
        const productJob = await scheduleProductJob(productId);
        return NextResponse.json({ 
          success: true, 
          message: 'Jobs programados para el producto',
          result: productJob
        });
      
      case 'initialize':
        const init = await initializeJobScheduler();
        return NextResponse.json({ 
          success: true, 
          message: 'Job Scheduler inicializado',
          result: init
        });
      
      case 'clean':
        const clean = await cleanQueues();
        return NextResponse.json({ 
          success: true, 
          message: 'Colas limpiadas',
          result: clean
        });
      
      case 'pause':
        const pause = await pauseAllQueues();
        return NextResponse.json({ 
          success: true, 
          message: 'Todas las colas pausadas',
          result: pause
        });
      
      case 'resume':
        const resume = await resumeAllQueues();
        return NextResponse.json({ 
          success: true, 
          message: 'Todas las colas reanudadas',
          result: resume
        });
      
      case 'start':
        const start = startProcessing();
        return NextResponse.json({ 
          success: true, 
          message: 'Procesamiento iniciado',
          result: start
        });
      
      case 'stop':
        const stop = stopProcessing();
        return NextResponse.json({ 
          success: true, 
          message: 'Procesamiento detenido',
          result: stop
        });
      
      case 'daily-calculation':
        const daily = await executeDailyCalculation();
        return NextResponse.json({ 
          success: true, 
          message: 'Cálculo diario ejecutado',
          result: daily
        });
      
      case 'get-jobs':
        if (!type) {
          return NextResponse.json(
            { error: 'Tipo de cola requerido' },
            { status: 400 }
          );
        }
        const jobs = getQueueJobs(type as 'popularity' | 'featured' | 'classification');
        return NextResponse.json({ 
          success: true, 
          jobs,
          count: jobs.length
        });
      
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error executing job action:', error);
    return NextResponse.json(
      { error: 'Error al ejecutar acción' },
      { status: 500 }
    );
  }
} 