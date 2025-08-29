# 👨‍💼 Administración API - Solecito Crochet

## 📋 Descripción General

La API de Administración proporciona acceso a funcionalidades avanzadas del sistema, incluyendo gestión de jobs asíncronos, estadísticas de popularidad, métricas de categorías y herramientas de monitoreo. Solo usuarios con roles ADMIN o SUPERADMIN pueden acceder a estos endpoints.

## 🔐 Autenticación

- **Todos los endpoints**: Requieren rol ADMIN o SUPERADMIN
- **Headers requeridos**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Rate limiting**: 500 requests/minuto para endpoints administrativos

## 📡 Endpoints Disponibles

### 1. GET /api/admin/jobs

Obtiene el estado y estadísticas de los jobs asíncronos del sistema.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `queue` | string | No | - | Filtrar por cola específica |
| `status` | string | No | - | Filtrar por estado (pending, processing, completed, failed) |
| `limit` | integer | No | 50 | Máximo de jobs a retornar |

#### Ejemplo de Request

```bash
curl -X GET "https://api.solecitocrochet.com/api/admin/jobs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filtrar por cola específica
curl -X GET "https://api.solecitocrochet.com/api/admin/jobs?queue=popularity" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Solo jobs fallidos
curl -X GET "https://api.solecitocrochet.com/api/admin/jobs?status=failed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Ejemplo de Response

```json
{
  "jobs": [
    {
      "id": "job-001",
      "type": "popularity_calculation",
      "queue": "popularity",
      "status": "completed",
      "priority": "high",
      "createdAt": "2024-01-15T06:00:00Z",
      "startedAt": "2024-01-15T06:00:01Z",
      "completedAt": "2024-01-15T06:00:15Z",
      "duration": 14,
      "result": {
        "productsProcessed": 150,
        "popularityScoresUpdated": 150,
        "featuredProducts": 22
      }
    },
    {
      "id": "job-002",
      "type": "image_optimization",
      "queue": "images",
      "status": "processing",
      "priority": "medium",
      "createdAt": "2024-01-15T06:05:00Z",
      "startedAt": "2024-01-15T06:05:30Z",
      "progress": 65
    }
  ],
  "stats": {
    "totalJobs": 150,
    "pending": 5,
    "processing": 3,
    "completed": 140,
    "failed": 2,
    "successRate": 93.33
  },
  "queues": {
    "popularity": {
      "pending": 2,
      "processing": 1,
      "completed": 45
    },
    "images": {
      "pending": 3,
      "processing": 2,
      "completed": 95
    }
  }
}
```

### 2. POST /api/admin/jobs/retry

Reintenta un job fallido.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Body del Request

```json
{
  "jobId": "job-003",
  "priority": "high"
}
```

#### Ejemplo de Request

```bash
curl -X POST "https://api.solecitocrochet.com/api/admin/jobs/retry" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job-003",
    "priority": "high"
  }'
```

#### Ejemplo de Response

```json
{
  "message": "Job programado para reintento",
  "job": {
    "id": "job-003",
    "type": "popularity_calculation",
    "status": "pending",
    "priority": "high",
    "retryCount": 1,
    "scheduledFor": "2024-01-15T06:10:00Z"
  }
}
```

### 3. POST /api/admin/jobs/cancel

Cancela un job en progreso o pendiente.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Body del Request

```json
{
  "jobId": "job-002"
}
```

#### Ejemplo de Request

```bash
curl -X POST "https://api.solecitocrochet.com/api/admin/jobs/cancel" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job-002"
  }'
```

#### Ejemplo de Response

```json
{
  "message": "Job cancelado exitosamente",
  "job": {
    "id": "job-002",
    "status": "cancelled",
    "cancelledAt": "2024-01-15T06:07:00Z"
  }
}
```

### 4. GET /api/admin/popularity

Obtiene estadísticas y métricas del sistema de popularidad.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `period` | string | No | `month` | Período de análisis (week, month, year) |
| `category` | string | No | - | Filtrar por categoría específica |
| `limit` | integer | No | 20 | Máximo de productos a retornar |

#### Ejemplo de Request

```bash
# Estadísticas generales
curl -X GET "https://api.solecitocrochet.com/api/admin/popularity" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Por período específico
curl -X GET "https://api.solecitocrochet.com/api/admin/popularity?period=week" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Por categoría
curl -X GET "https://api.solecitocrochet.com/api/admin/popularity?category=amigurumis" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Ejemplo de Response

```json
{
  "period": "month",
  "general": {
    "totalProducts": 150,
    "popularProducts": 30,
    "featuredProducts": 22,
    "averagePopularityScore": 75.5,
    "averageFeaturedScore": 85.2
  },
  "topProducts": [
    {
      "id": "prod-001",
      "name": "Gatito Amigurumi",
      "popularityScore": 95.8,
      "featuredScore": 92.1,
      "isPopular": true,
      "isFeatured": true,
      "metrics": {
        "weeklyClicks": 45,
        "monthlyClicks": 180,
        "whatsappClicks": 25,
        "favoriteClicks": 32,
        "totalClicks": 450
      }
    }
  ],
  "categoryStats": {
    "amigurumis": {
      "totalProducts": 45,
      "popularProducts": 12,
      "featuredProducts": 8,
      "averageScore": 78.3
    },
    "mantas": {
      "totalProducts": 30,
      "popularProducts": 8,
      "featuredProducts": 6,
      "averageScore": 72.1
    }
  },
  "trends": {
    "weeklyGrowth": 12.5,
    "monthlyGrowth": 8.3,
    "topPerformingCategory": "amigurumis"
  }
}
```

### 5. POST /api/admin/popularity/recalculate

Fuerza el recálculo manual de scores de popularidad.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Body del Request

```json
{
  "productIds": ["prod-001", "prod-002"],
  "forceFullRecalculation": false
}
```

#### Ejemplo de Request

```bash
curl -X POST "https://api.solecitocrochet.com/api/admin/popularity/recalculate" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productIds": ["prod-001", "prod-002"],
    "forceFullRecalculation": false
  }'
```

#### Ejemplo de Response

```json
{
  "message": "Recálculo de popularidad iniciado",
  "job": {
    "id": "job-004",
    "type": "popularity_recalculation",
    "status": "pending",
    "estimatedDuration": "2-5 minutos"
  },
  "productsToProcess": 2
}
```

### 6. GET /api/admin/categories/stats

Obtiene estadísticas detalladas de categorías.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `period` | string | No | `month` | Período de análisis (week, month, year) |
| `includeInactive` | boolean | No | `false` | Incluir categorías inactivas |

#### Ejemplo de Request

```bash
# Estadísticas del mes actual
curl -X GET "https://api.solecitocrochet.com/api/admin/categories/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Por período específico
curl -X GET "https://api.solecitocrochet.com/api/admin/categories/stats?period=year" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Incluir inactivas
curl -X GET "https://api.solecitocrochet.com/api/admin/categories/stats?includeInactive=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Ejemplo de Response

```json
{
  "period": "month",
  "general": {
    "totalCategories": 8,
    "totalProducts": 150,
    "totalValue": 4500.75,
    "totalFeatured": 22,
    "growthRate": 12.5
  },
  "topCategories": [
    {
      "id": "cat-001",
      "name": "Amigurumis",
      "slug": "amigurumis",
      "icon": "🧸",
      "productCount": 45,
      "totalValue": 1350.25,
      "averagePrice": 30.01,
      "featuredCount": 8,
      "isCustom": false
    }
  ],
  "expensiveCategories": [
    {
      "id": "cat-002",
      "name": "Mantas y Cobijas",
      "slug": "mantas-cobijas",
      "icon": "🛏️",
      "averagePrice": 85.50,
      "productCount": 18
    }
  ],
  "featuredByCategory": [
    {
      "id": "cat-001",
      "name": "Amigurumis",
      "featuredCount": 8,
      "percentage": 17.78
    }
  ],
  "categories": [
    {
      "id": "cat-001",
      "name": "Amigurumis",
      "slug": "amigurumis",
      "icon": "🧸",
      "description": "Muñecos y figuras tejidas a crochet",
      "isActive": true,
      "isCustom": false,
      "productCount": 45,
      "totalValue": 1350.25,
      "averagePrice": 30.01,
      "featuredCount": 8
    }
  ]
}
```

## 🏗️ Sistema de Jobs Asíncronos

### Colas Disponibles

| Cola | Propósito | Prioridad | Frecuencia |
|------|-----------|-----------|------------|
| **popularity** | Cálculo de scores de popularidad | Alta | Diaria (6:00 AM) |
| **featured** | Clasificación de productos destacados | Alta | Diaria (6:00 AM) |
| **images** | Optimización y procesamiento de imágenes | Media | En tiempo real |
| **cleanup** | Limpieza de datos antiguos | Baja | Semanal |

### Estados de Jobs

| Estado | Descripción |
|--------|-------------|
| **pending** | Job en cola esperando procesamiento |
| **processing** | Job siendo ejecutado actualmente |
| **completed** | Job completado exitosamente |
| **failed** | Job falló durante la ejecución |
| **cancelled** | Job cancelado por administrador |
| **retrying** | Job programado para reintento |

### Prioridades

| Prioridad | Descripción | Tiempo de Espera |
|-----------|-------------|-------------------|
| **critical** | Tareas críticas del sistema | Inmediato |
| **high** | Tareas importantes | < 1 minuto |
| **medium** | Tareas normales | < 5 minutos |
| **low** | Tareas de bajo impacto | < 15 minutos |

## 📊 Sistema de Popularidad

### Fórmulas de Cálculo

#### Popularity Score
```typescript
const popularityScore = 
  (weeklyClicks × 0.4) + 
  (monthlyClicks × 0.3) + 
  (whatsappClicks × 2.0) + 
  (favoriteClicks × 1.5) + 
  (totalClicks × 0.1);
```

#### Featured Score
```typescript
const featuredScore = 
  (whatsappClicks × 3.0) + 
  (favoriteClicks × 1.0) + 
  (weeklyClicks × 0.5) + 
  (monthlyClicks × 0.3);
```

### Clasificación Automática

- **Productos Populares**: Top 20% por popularity score
- **Productos Destacados**: Top 15% por featured score
- **Actualización**: Automática diaria a las 6:00 AM

## 🔍 Monitoreo y Alertas

### Métricas Clave

- **Tasa de éxito** de jobs (> 95% esperado)
- **Tiempo de procesamiento** promedio
- **Colas bloqueadas** o con retrasos
- **Errores recurrentes** en jobs

### Alertas Automáticas

- **Jobs fallidos** consecutivos
- **Colas con más de 100 jobs pendientes**
- **Tiempo de procesamiento** > 10 minutos
- **Uso de memoria** > 80%

## 🚨 Manejo de Errores

### Códigos de Error Comunes

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `JOB_NOT_FOUND` | 404 | Job no encontrado |
| `JOB_ALREADY_COMPLETED` | 400 | Job ya fue completado |
| `JOB_IN_PROGRESS` | 400 | Job está siendo procesado |
| `QUEUE_OVERFLOW` | 429 | Cola excede límite máximo |
| `UNAUTHORIZED` | 401 | Token faltante o inválido |
| `FORBIDDEN` | 403 | Permisos insuficientes |

### Ejemplo de Error Response

```json
{
  "error": {
    "code": "JOB_IN_PROGRESS",
    "message": "No se puede cancelar un job que ya está siendo procesado",
    "details": {
      "jobId": "job-002",
      "status": "processing",
      "startedAt": "2024-01-15T06:05:30Z"
    }
  },
  "timestamp": "2024-01-15T06:07:00Z"
}
```

## 🔄 Operaciones en Lote

### Cancelar Múltiples Jobs

```bash
POST /api/admin/jobs/cancel/batch
```

```json
{
  "jobIds": ["job-001", "job-002", "job-003"],
  "reason": "Mantenimiento programado"
}
```

### Limpiar Jobs Completados

```bash
POST /api/admin/jobs/cleanup
```

```json
{
  "olderThan": "7d",
  "status": ["completed", "failed"],
  "dryRun": false
}
```

## 📈 Mejores Prácticas

### Para Administradores

1. **Monitorear colas** regularmente para detectar bloqueos
2. **Revisar jobs fallidos** para identificar problemas recurrentes
3. **Programar recálculos** durante horas de bajo tráfico
4. **Mantener métricas** de rendimiento del sistema

### Para Desarrolladores

1. **Implementar retry logic** para jobs críticos
2. **Usar prioridades** apropiadas para diferentes tipos de jobs
3. **Manejar timeouts** y cancelaciones correctamente
4. **Logging detallado** para debugging

## 🔗 Endpoints Relacionados

- **[📦 Productos](./products.md)** - Gestión de productos y popularidad
- **[📂 Categorías](./categories.md)** - Estadísticas de categorías
- **[🖼️ Imágenes](./images.md)** - Procesamiento de imágenes
- **[🏗️ Arquitectura](./../architecture/README.md)** - Diseño del sistema administrativo

## ⚙️ Configuración del Sistema

### Variables de Entorno

```env
# Configuración de Jobs
JOB_MAX_RETRIES=3
JOB_TIMEOUT=300000
JOB_MAX_QUEUE_SIZE=1000

# Configuración de Popularidad
POPULARITY_UPDATE_HOUR=6
POPULARITY_BATCH_SIZE=50
FEATURED_PERCENTAGE=15
POPULAR_PERCENTAGE=20

# Configuración de Monitoreo
ADMIN_RATE_LIMIT=500
ADMIN_ALERT_EMAIL=admin@solecitocrochet.com
```

---

*👨‍💼 Panel administrativo completo para gestión y monitoreo del sistema*
