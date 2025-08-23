import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { 
  calculateProductPopularity, 
  calculateProductFeatured, 
  updateProductClassification 
} from './productMetrics';

const prisma = new PrismaClient();

// Interfaz para los jobs en cola
interface QueuedJob {
  id: string;
  productId: string;
  productName: string;
  type: 'popularity' | 'featured' | 'classification';
  priority: number;
  createdAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
}

// Colas en memoria
const popularityQueue: QueuedJob[] = [];
const featuredQueue: QueuedJob[] = [];
const classificationQueue: QueuedJob[] = [];

// Estado del scheduler
let isRunning = false;
let isPaused = false;

// Configuración
const MAX_CONCURRENT_JOBS = 3;
const MAX_ATTEMPTS = 3;
const JOB_DELAY = 1000; // 1 segundo entre jobs

// Función para agregar job a una cola
function addToQueue(queue: QueuedJob[], job: Omit<QueuedJob, 'id' | 'createdAt' | 'status' | 'attempts'>): string {
  const queuedJob: QueuedJob = {
    ...job,
    id: `${job.type}-${job.productId}-${Date.now()}`,
    createdAt: new Date(),
    status: 'pending',
    attempts: 0
  };
  
  // Insertar ordenado por prioridad
  const insertIndex = queue.findIndex(qj => qj.priority > job.priority);
  if (insertIndex === -1) {
    queue.push(queuedJob);
  } else {
    queue.splice(insertIndex, 0, queuedJob);
  }
  
  console.log(`📝 Job agregado a cola ${job.type}: ${job.productName} (Prioridad: ${job.priority})`);
  return queuedJob.id;
}

// Función para procesar un job
async function processJob(job: QueuedJob): Promise<boolean> {
  try {
    console.log(`🔄 Procesando job ${job.type} para producto: ${job.productName}`);
    
    job.status = 'running';
    
    let result;
    switch (job.type) {
      case 'popularity':
        result = await calculateProductPopularity(job.productId);
        break;
      case 'featured':
        result = await calculateProductFeatured(job.productId);
        break;
      case 'classification':
        result = await updateProductClassification(job.productId);
        break;
      default:
        throw new Error(`Tipo de job no válido: ${job.type}`);
    }
    
    console.log(`✅ Job ${job.type} completado para ${job.productName}`);
    
    job.status = 'completed';
    return true;
    
  } catch (error) {
    console.error(`❌ Error procesando job ${job.type} para ${job.productName}:`, error);
    
    job.attempts++;
    if (job.attempts >= job.maxAttempts) {
      job.status = 'failed';
      console.error(`💀 Job ${job.type} falló definitivamente para ${job.productName} después de ${job.attempts} intentos`);
    } else {
      job.status = 'pending';
      console.log(`🔄 Reintentando job ${job.type} para ${job.productName} (intento ${job.attempts + 1}/${job.maxAttempts})`);
    }
    
    return false;
  }
}

// Función para procesar colas
async function processQueues() {
  if (isPaused || !isRunning) return;
  
  // Procesar cola de popularidad
  const popularityJob = popularityQueue.find(job => job.status === 'pending');
  if (popularityJob) {
    await processJob(popularityJob);
  }
  
  // Procesar cola de destacado
  const featuredJob = featuredQueue.find(job => job.status === 'pending');
  if (featuredJob) {
    await processJob(featuredJob);
  }
  
  // Procesar cola de clasificación
  const classificationJob = classificationQueue.find(job => job.status === 'pending');
  if (classificationJob) {
    await processJob(classificationJob);
  }
}

// Función para programar jobs para todos los productos
export async function scheduleAllProductJobs(): Promise<{ success: boolean; productsCount: number }> {
  try {
    console.log('🚀 Programando jobs para todos los productos...');
    
    // Limpiar colas existentes
    popularityQueue.length = 0;
    featuredQueue.length = 0;
    classificationQueue.length = 0;
    
    // Obtener todos los productos activos
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true }
    });
    
    console.log(`📦 Encontrados ${products.length} productos para procesar`);
    
    // Programar jobs con prioridades
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Job de popularidad (prioridad 1 - más alta)
      addToQueue(popularityQueue, {
        productId: product.id,
        productName: product.name,
        type: 'popularity',
        priority: 1,
        maxAttempts: MAX_ATTEMPTS
      });
      
      // Job de destacado (prioridad 2)
      addToQueue(featuredQueue, {
        productId: product.id,
        productName: product.name,
        type: 'featured',
        priority: 2,
        maxAttempts: MAX_ATTEMPTS
      });
      
      // Job de clasificación (prioridad 3 - más baja)
      addToQueue(classificationQueue, {
        productId: product.id,
        productName: product.name,
        type: 'classification',
        priority: 3,
        maxAttempts: MAX_ATTEMPTS
      });
    }
    
    console.log(`✅ Jobs programados para ${products.length} productos`);
    return { success: true, productsCount: products.length };
    
  } catch (error) {
    console.error('❌ Error programando jobs:', error);
    throw error;
  }
}

// Función para programar job para un producto específico
export async function scheduleProductJob(productId: string): Promise<{ success: boolean; productId: string; jobs: string[] }> {
  try {
    console.log(`🚀 Programando jobs para producto: ${productId}`);
    
    // Verificar que el producto existe y está activo
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true, name: true }
    });
    
    if (!product) {
      throw new Error(`Producto ${productId} no encontrado o inactivo`);
    }
    
    // Programar jobs inmediatamente
    const popularityJobId = addToQueue(popularityQueue, {
      productId: product.id,
      productName: product.name,
      type: 'popularity',
      priority: 1,
      maxAttempts: MAX_ATTEMPTS
    });
    
    const featuredJobId = addToQueue(featuredQueue, {
      productId: product.id,
      productName: product.name,
      type: 'featured',
      priority: 2,
      maxAttempts: MAX_ATTEMPTS
    });
    
    const classificationJobId = addToQueue(classificationQueue, {
      productId: product.id,
      productName: product.name,
      type: 'classification',
      priority: 3,
      maxAttempts: MAX_ATTEMPTS
    });
    
    console.log(`✅ Jobs programados para producto ${product.name}`);
    
    return { 
      success: true, 
      productId, 
      jobs: [popularityJobId, featuredJobId, classificationJobId]
    };
    
  } catch (error) {
    console.error(`❌ Error programando jobs para producto ${productId}:`, error);
    throw error;
  }
}

// Función para obtener estadísticas de las colas
export function getQueueStats() {
  const getQueueStatus = (queue: QueuedJob[]) => ({
    waiting: queue.filter(job => job.status === 'pending').length,
    running: queue.filter(job => job.status === 'running').length,
    completed: queue.filter(job => job.status === 'completed').length,
    failed: queue.filter(job => job.status === 'failed').length
  });
  
  return {
    popularity: getQueueStatus(popularityQueue),
    featured: getQueueStatus(featuredQueue),
    classification: getQueueStatus(classificationQueue),
    total: {
      waiting: popularityQueue.filter(j => j.status === 'pending').length + 
               featuredQueue.filter(j => j.status === 'pending').length + 
               classificationQueue.filter(j => j.status === 'pending').length,
      running: popularityQueue.filter(j => j.status === 'running').length + 
               featuredQueue.filter(j => j.status === 'running').length + 
               classificationQueue.filter(j => j.status === 'running').length,
      completed: popularityQueue.filter(j => j.status === 'completed').length + 
                 featuredQueue.filter(j => j.status === 'completed').length + 
                 classificationQueue.filter(j => j.status === 'completed').length,
      failed: popularityQueue.filter(j => j.status === 'failed').length + 
              featuredQueue.filter(j => j.status === 'failed').length + 
              classificationQueue.filter(j => j.status === 'failed').length
    },
    scheduler: {
      isRunning,
      isPaused,
      totalJobs: popularityQueue.length + featuredQueue.length + classificationQueue.length
    }
  };
}

// Función para limpiar colas
export function cleanQueues() {
  const beforeCount = popularityQueue.length + featuredQueue.length + classificationQueue.length;
  
  // Mantener solo jobs fallidos para análisis
  const failedJobs = [
    ...popularityQueue.filter(job => job.status === 'failed'),
    ...featuredQueue.filter(job => job.status === 'failed'),
    ...classificationQueue.filter(job => job.status === 'failed')
  ];
  
  popularityQueue.length = 0;
  featuredQueue.length = 0;
  classificationQueue.length = 0;
  
  // Restaurar jobs fallidos
  failedJobs.forEach(job => {
    if (job.type === 'popularity') popularityQueue.push(job);
    else if (job.type === 'featured') featuredQueue.push(job);
    else if (job.type === 'classification') classificationQueue.push(job);
  });
  
  const afterCount = popularityQueue.length + featuredQueue.length + classificationQueue.length;
  const cleanedCount = beforeCount - afterCount;
  
  console.log(`🧹 Colas limpiadas: ${cleanedCount} jobs eliminados, ${afterCount} jobs fallidos mantenidos`);
  
  return { 
    success: true, 
    cleaned: cleanedCount, 
    remaining: afterCount 
  };
}

// Función para pausar todas las colas
export function pauseAllQueues() {
  isPaused = true;
  console.log('⏸️ Todas las colas pausadas');
  return { success: true };
}

// Función para reanudar todas las colas
export function resumeAllQueues() {
  isPaused = false;
  console.log('▶️ Todas las colas reanudadas');
  return { success: true };
}

// Función para iniciar el procesamiento
export function startProcessing() {
  if (isRunning) {
    console.log('⚠️ El procesamiento ya está ejecutándose');
    return { success: false, message: 'Ya está ejecutándose' };
  }
  
  isRunning = true;
  isPaused = false;
  
  // Procesar colas cada segundo
  const interval = setInterval(async () => {
    if (!isRunning) {
      clearInterval(interval);
      return;
    }
    
    await processQueues();
  }, JOB_DELAY);
  
  console.log('🚀 Procesamiento de colas iniciado');
  return { success: true, message: 'Procesamiento iniciado' };
}

// Función para detener el procesamiento
export function stopProcessing() {
  isRunning = false;
  console.log('🛑 Procesamiento de colas detenido');
  return { success: true, message: 'Procesamiento detenido' };
}

// Función para inicializar el scheduler
export async function initializeJobScheduler() {
  try {
    console.log('🚀 Inicializando Job Scheduler...');
    
    // Programar jobs diarios a medianoche UTC Nicaragua (6:00 AM hora local)
    cron.schedule('0 6 * * *', async () => {
      console.log('🕛 Ejecutando jobs diarios programados...');
      try {
        await scheduleAllProductJobs();
        startProcessing();
      } catch (error) {
        console.error('❌ Error ejecutando jobs diarios:', error);
      }
    }, {
      timezone: 'America/Managua' // UTC-6 (Nicaragua)
    });
    
    console.log('✅ Cron job diario programado para 6:00 AM hora Nicaragua');
    
    // Programar jobs para productos existentes (solo en la primera ejecución)
    const stats = getQueueStats();
    if (stats.total.waiting === 0 && stats.total.running === 0) {
      console.log('📦 Programando jobs para productos existentes...');
      await scheduleAllProductJobs();
    }
    
    // Iniciar procesamiento
    startProcessing();
    
    console.log('✅ Job Scheduler inicializado exitosamente');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error inicializando Job Scheduler:', error);
    throw error;
  }
}

// Función para ejecutar cálculo diario manualmente
export async function executeDailyCalculation() {
  try {
    console.log('🕛 Ejecutando cálculo diario manualmente...');
    
    await scheduleAllProductJobs();
    startProcessing();
    
    return { success: true, message: 'Cálculo diario ejecutado' };
    
  } catch (error) {
    console.error('❌ Error ejecutando cálculo diario:', error);
    throw error;
  }
}

// Función para obtener jobs de una cola específica
export function getQueueJobs(type: 'popularity' | 'featured' | 'classification') {
  let queue: QueuedJob[];
  
  switch (type) {
    case 'popularity':
      queue = popularityQueue;
      break;
    case 'featured':
      queue = featuredQueue;
      break;
    case 'classification':
      queue = classificationQueue;
      break;
    default:
      return [];
  }
  
  return queue.map(job => ({
    id: job.id,
    productId: job.productId,
    productName: job.productName,
    type: job.type,
    priority: job.priority,
    status: job.status,
    attempts: job.attempts,
    createdAt: job.createdAt
  }));
} 