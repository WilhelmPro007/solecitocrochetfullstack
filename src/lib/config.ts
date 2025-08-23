// Configuración del Job Scheduler
export const SCHEDULER_CONFIG = {
  // Configuración de jobs
  MAX_CONCURRENT_JOBS: 3,
  MAX_ATTEMPTS: 3,
  JOB_DELAY: 1000, // 1 segundo entre jobs
  
  // Configuración de cron
  DAILY_CRON_TIME: '0 6 * * *', // 6:00 AM hora Nicaragua
  TIMEZONE: 'America/Managua',   // UTC-6 (Nicaragua)
  
  // Configuración de colas
  QUEUE_NAMES: {
    POPULARITY: 'popularity',
    FEATURED: 'featured',
    CLASSIFICATION: 'classification'
  },
  
  // Prioridades de jobs
  PRIORITIES: {
    POPULARITY: 1,      // Más alta
    FEATURED: 2,        // Media
    CLASSIFICATION: 3    // Más baja
  },
  
  // Configuración de limpieza
  CLEANUP: {
    KEEP_FAILED_JOBS: true,    // Mantener jobs fallidos para análisis
    AUTO_CLEANUP_INTERVAL: 24 * 60 * 60 * 1000 // 24 horas
  }
};

// Configuración de logging
export const LOG_CONFIG = {
  ENABLE_VERBOSE_LOGGING: process.env.NODE_ENV === 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'simple'
};

// Configuración de entorno
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  INITIALIZE_JOBS: process.env.INITIALIZE_JOBS === 'true',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true'
}; 