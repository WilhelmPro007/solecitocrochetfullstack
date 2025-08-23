import { initializeJobScheduler } from './simpleJobScheduler';

let isInitialized = false;

export async function initializeStartupServices() {
  if (isInitialized) {
    console.log('⚠️ Servicios de startup ya inicializados');
    return;
  }

  try {
    console.log('🚀 Inicializando servicios de startup...');
    
    // Solo inicializar en producción o cuando se especifique
    if (process.env.NODE_ENV === 'production' || process.env.INITIALIZE_JOBS === 'true') {
      console.log('📦 Inicializando Job Scheduler...');
      await initializeJobScheduler();
      console.log('✅ Job Scheduler inicializado');
    } else {
      console.log('⚠️ Job Scheduler no inicializado (modo desarrollo)');
    }
    
    isInitialized = true;
    console.log('✅ Servicios de startup inicializados exitosamente');
    
  } catch (error) {
    console.error('❌ Error inicializando servicios de startup:', error);
    // No lanzar error para evitar que la app falle
  }
}

// Función para verificar si los servicios están inicializados
export function areServicesInitialized(): boolean {
  return isInitialized;
}

// Función para reinicializar servicios (útil para testing)
export async function reinitializeServices() {
  console.log('🔄 Reinicializando servicios...');
  isInitialized = false;
  await initializeStartupServices();
} 