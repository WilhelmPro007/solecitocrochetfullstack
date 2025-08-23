# 🚀 Sistema de Job Scheduling Simplificado - Solecito Crochet

## 🎯 **Resumen del Sistema**

Sistema de **job scheduling** que ejecuta métricas de popularidad y destacado **por cada producto individual**, usando **solo librerías de Node.js** sin dependencias externas como Redis o aplicaciones del sistema.

## 🏗️ **Arquitectura del Sistema**

### **📁 Componentes Principales**
```
src/
├── lib/
│   ├── simpleJobScheduler.ts  # Sistema principal de job scheduling
│   ├── productMetrics.ts      # Cálculo individual por producto
│   ├── popularity.ts          # Funciones de popularidad
│   ├── config.ts              # Configuración del sistema
│   └── startupService.ts      # Inicialización automática
├── app/
│   └── api/
│       └── admin/
│           └── jobs/          # Endpoint de gestión de jobs
└── components/
    └── landing/
        ├── featuredProducts.tsx
        └── popularProducts.tsx
```

### **🔄 Flujo de Jobs**
1. **Job de Popularidad** → Calcula score de popularidad
2. **Job de Destacado** → Calcula score de destacado  
3. **Job de Clasificación** → Actualiza clasificaciones automáticas

## ⚙️ **Configuración Requerida**

### **1. Variables de Entorno**
```env
# Job Scheduler
INITIALIZE_JOBS=true
DEBUG_MODE=false

# Entorno
NODE_ENV=development
```

### **2. Dependencias Instaladas**
```bash
npm install node-cron @types/node-cron
```

### **3. Sin Dependencias Externas**
- ❌ **NO Redis** - Solo memoria
- ❌ **NO aplicaciones del sistema** - Solo librerías npm
- ✅ **Funciona en Windows y Linux** - Sin configuración externa

## 🚀 **Funcionalidades del Sistema**

### **📊 Jobs por Producto Individual**
- **Cálculo de Popularidad**: Score basado en clicks y engagement
- **Cálculo de Destacado**: Score basado en WhatsApp y favoritos
- **Clasificación Automática**: Top 20% populares, Top 15% destacados

### **⏰ Programación Inteligente**
- **Ejecución diaria** a las 6:00 AM hora Nicaragua (medianoche UTC Nicaragua)
- **Jobs escalonados** con 1 segundo entre cada producto
- **Prioridades**: Popularidad (1) → Destacado (2) → Clasificación (3)

### **🔄 Gestión de Colas en Memoria**
- **Cola de Popularidad**: `popularityQueue`
- **Cola de Destacado**: `featuredQueue`
- **Cola de Clasificación**: `classificationQueue`

## 📱 **Endpoints de la API**

### **🔄 Gestión de Jobs**
```http
# Obtener estadísticas
GET /api/admin/jobs?action=stats

# Obtener estado del scheduler
GET /api/admin/jobs?action=status

# Programar jobs para todos los productos
POST /api/admin/jobs
Body: { "action": "schedule-all" }

# Programar jobs para un producto específico
POST /api/admin/jobs
Body: { "action": "schedule-product", "productId": "uuid" }

# Inicializar scheduler
POST /api/admin/jobs
Body: { "action": "initialize" }

# Iniciar procesamiento
POST /api/admin/jobs
Body: { "action": "start" }

# Detener procesamiento
POST /api/admin/jobs
Body: { "action": "stop" }

# Pausar todas las colas
POST /api/admin/jobs
Body: { "action": "pause" }

# Reanudar todas las colas
POST /api/admin/jobs
Body: { "action": "resume" }

# Limpiar colas
POST /api/admin/jobs
Body: { "action": "clean" }

# Ejecutar cálculo diario manualmente
POST /api/admin/jobs
Body: { "action": "daily-calculation" }

# Obtener jobs de una cola específica
POST /api/admin/jobs
Body: { "action": "get-jobs", "type": "popularity" }
```

### **📊 Métricas de Productos**
```http
# Productos populares
GET /api/products/popular?limit=6&category=amigurumis

# Productos destacados
GET /api/products/featured?limit=6&category=amigurumis

# Estadísticas de popularidad
GET /api/admin/popularity?action=stats
```

## 🔧 **Implementación y Uso**

### **1. Inicialización Automática**
```typescript
// Se ejecuta automáticamente al iniciar la app
import { initializeStartupServices } from '@/lib/startupService';

// En producción o cuando INITIALIZE_JOBS=true
await initializeStartupServices();
```

### **2. Programar Jobs Manualmente**
```typescript
import { scheduleAllProductJobs, scheduleProductJob } from '@/lib/simpleJobScheduler';

// Programar para todos los productos
await scheduleAllProductJobs();

// Programar para un producto específico
await scheduleProductJob('product-uuid');
```

### **3. Monitorear Colas**
```typescript
import { getQueueStats } from '@/lib/simpleJobScheduler';

const stats = await getQueueStats();
console.log('Estadísticas de colas:', stats);
```

## 📈 **Métricas y Analytics**

### **📊 Estadísticas de Colas**
```typescript
{
  popularity: {
    waiting: 0,      // Jobs en espera
    running: 2,      // Jobs ejecutándose
    completed: 150,  // Jobs completados
    failed: 0        // Jobs fallidos
  },
  featured: { ... },
  classification: { ... },
  total: { ... },
  scheduler: {
    isRunning: true,
    isPaused: false,
    totalJobs: 450
  }
}
```

### **🏆 Rankings de Productos**
```typescript
// Top productos populares
const popularProducts = await getProductRankings(10, 'amigurumis');

// Top productos destacados
const featuredProducts = await getProductRankings(10, 'amigurumis');
```

## 🚨 **Monitoreo y Mantenimiento**

### **📋 Checklist Diario**
- [ ] Verificar ejecución de jobs diarios
- [ ] Revisar logs de colas
- [ ] Monitorear estadísticas de memoria
- [ ] Validar clasificaciones automáticas

### **📋 Checklist Semanal**
- [ ] Revisar jobs fallidos
- [ ] Analizar rendimiento de colas
- [ ] Limpiar colas antiguas
- [ ] Verificar métricas de rendimiento

### **📋 Checklist Mensual**
- [ ] Revisar tendencias de jobs
- [ ] Optimizar configuración de colas
- [ ] Backup de métricas históricas
- [ ] Análisis de rendimiento general

## 🔍 **Resolución de Problemas**

### **❌ Jobs No Se Ejecutan**
1. **Verificar estado**: `GET /api/admin/jobs?action=status`
2. **Revisar logs**: Colas pausadas o errores
3. **Verificar procesamiento**: `POST /api/admin/jobs` con `action: start`
4. **Reinicializar**: `POST /api/admin/jobs` con `action: initialize`

### **❌ Colas Bloqueadas**
1. **Pausar y reanudar**: `pause` → `resume`
2. **Limpiar colas**: `action: clean`
3. **Revisar jobs fallidos**: Logs de error
4. **Reiniciar procesamiento**: `stop` → `start`

### **❌ Rendimiento Lento**
1. **Reducir delay entre jobs**: Modificar en `config.ts`
2. **Aumentar workers**: Configurar más procesos
3. **Optimizar consultas**: Revisar funciones de métricas
4. **Monitorear memoria**: Estadísticas del sistema

## 🎯 **Beneficios del Sistema**

### **💼 Para el Negocio**
1. **Métricas en tiempo real** por producto individual
2. **Clasificación automática** sin intervención manual
3. **Escalabilidad** para miles de productos
4. **Monitoreo completo** del comportamiento de usuarios

### **👥 Para los Usuarios**
1. **Productos relevantes** siempre actualizados
2. **Descubrimiento inteligente** basado en métricas reales
3. **Experiencia personalizada** en la landing
4. **Recomendaciones precisas** por categoría

### **🛠️ Para los Desarrolladores**
1. **Sistema simple** sin dependencias externas
2. **Jobs programados** con prioridades y reintentos
3. **API completa** para gestión y monitoreo
4. **Logs detallados** para debugging

## 🔮 **Futuras Mejoras**

### **📱 Persistencia**
- Guardar jobs en archivos JSON
- Backup automático de métricas
- Historial de ejecuciones

### **📊 Analytics Avanzados**
- Dashboard en tiempo real
- Métricas de conversión
- Análisis de cohortes por producto

### **🎨 UI/UX**
- Panel de control visual para jobs
- Gráficos de métricas en tiempo real
- Alertas automáticas por email

---

## 🎉 **¡Sistema Completamente Funcional!**

El **Job Scheduler Simplificado** está implementado y listo para producción, ejecutando métricas individuales por producto de forma automática y eficiente, **sin dependencias externas**. 🚀📊

## ✅ **Ventajas del Sistema Simplificado:**

1. **🚀 Solo librerías npm** - Sin Redis, sin aplicaciones externas
2. **💻 Funciona en Windows y Linux** - Sin configuración del sistema
3. **📦 Fácil de desplegar** - Solo copiar archivos y configurar variables
4. **🔧 Mantenimiento simple** - Todo en un solo lugar
5. **📊 Monitoreo completo** - Estadísticas y logs detallados 