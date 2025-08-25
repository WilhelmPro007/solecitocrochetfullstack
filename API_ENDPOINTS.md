# 📚 API Endpoints - Solecito Crochet

## 📋 Índice
- [Autenticación y Usuarios](#autenticación-y-usuarios)
- [Productos](#productos)
- [Categorías](#categorías)
- [Imágenes](#imágenes)
- [Administración](#administración)
- [Sistema de Jobs](#sistema-de-jobs)
- [Cron Jobs](#cron-jobs)
- [Carrito](#carrito)

---

## 🔐 Autenticación y Usuarios

### NextAuth Configuration
```
POST /api/auth/[...nextauth]
```
**Descripción:** Endpoint de NextAuth.js para autenticación
**Funcionalidades:**
- Login/Logout
- Gestión de sesiones
- OAuth providers
- JWT handling

### Registro de Usuarios
```
POST /api/register
```
**Descripción:** Crear nueva cuenta de usuario
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Respuesta:**
```json
{
  "success": boolean,
  "message": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CLIENTE"
  }
}
```

---

## 🛍️ Productos

### Obtener Productos
```
GET /api/products
```
**Query Parameters:**
- `category` (string): Filtrar por categoría
- `active` (boolean): Filtrar por estado activo
- `featured` (boolean): Filtrar productos destacados

**Respuesta:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "stock": "number",
    "isActive": "boolean",
    "featured": "boolean",
    "images": [
      {
        "id": "string",
        "url": "string",
        "altText": "string",
        "isMain": "boolean",
        "order": "number"
      }
    ],
    "creator": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
]
```

### Crear Producto
```
POST /api/products
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "number",
  "featured": "boolean",
  "materials": "string",
  "dimensions": "string",
  "weight": "string",
  "careInstructions": "string"
}
```

### Obtener Producto por ID
```
GET /api/products/[id]
```
**Path Parameters:**
- `id` (string): ID del producto

**Respuesta:** Producto individual con todas las relaciones

### Actualizar Producto
```
PUT /api/products/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID del producto

**Body:** Mismos campos que crear producto

### Eliminar Producto (Soft Delete)
```
DELETE /api/products/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID del producto

### Productos Destacados
```
GET /api/products/featured
```
**Descripción:** Obtener productos marcados como destacados
**Respuesta:** Array de productos destacados

### Productos Populares
```
GET /api/products/popular
```
**Query Parameters:**
- `limit` (number): Número máximo de productos

**Descripción:** Obtener productos ordenados por popularidad
**Respuesta:** Array de productos con métricas de popularidad

### Tracking de Productos
```
POST /api/products/[id]/track
```
**Descripción:** Registrar interacción con producto
**Body:**
```json
{
  "clickType": "view" | "whatsapp" | "favorite"
}
```

---

## 📂 Categorías

### Obtener Categorías
```
GET /api/categories
```
**Descripción:** Obtener todas las categorías con contador de productos
**Respuesta:**
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "icon": "string",
      "productCount": "number"
    }
  ],
  "totalProducts": "number"
}
```

### Crear Categoría
```
POST /api/categories
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Body:**
```json
{
  "name": "string",
  "slug": "string",
  "icon": "string",
  "description": "string",
  "isActive": "boolean"
}
```

### Actualizar Categoría
```
PUT /api/categories/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la categoría

### Eliminar Categoría
```
DELETE /api/categories/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la categoría

---

## 🖼️ Imágenes

### Subir Imagen
```
POST /api/images
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Body:** FormData
- `file`: Archivo de imagen
- `type`: "product" | "category"
- `productId`: ID del producto (opcional)
- `altText`: Texto alternativo
- `isMain`: Si es imagen principal
- `order`: Orden de la imagen

**Respuesta:**
```json
{
  "id": "string",
  "url": "string",
  "altText": "string",
  "isMain": "boolean",
  "order": "number"
}
```

### Obtener Imagen
```
GET /api/images/[id]
```
**Path Parameters:**
- `id` (string): ID de la imagen

**Descripción:** Retorna el archivo de imagen o URL

### Actualizar Imagen
```
PUT /api/images/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la imagen

### Eliminar Imagen
```
DELETE /api/images/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la imagen

---

## ⚙️ Administración

### Estadísticas de Jobs
```
GET /api/admin/jobs
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Query Parameters:**
- `action`: "stats" | "status"

**Respuesta:**
```json
{
  "popularityQueue": "number",
  "featuredQueue": "number",
  "classificationQueue": "number",
  "isRunning": "boolean",
  "isPaused": "boolean"
}
```

### Control de Jobs
```
POST /api/admin/jobs
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Body:**
```json
{
  "action": "schedule-all" | "schedule-product" | "clean" | "pause" | "resume" | "start" | "stop" | "daily-calculation",
  "productId": "string", // opcional
  "type": "popularity" | "featured" | "classification" // opcional
}
```

### Gestión de Popularidad
```
GET /api/admin/popularity
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Descripción:** Obtener métricas de popularidad

```
POST /api/admin/popularity
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Descripción:** Ejecutar cálculos de popularidad

---

## 🔄 Sistema de Jobs

### Programar Jobs para Todos los Productos
```typescript
// Función interna
scheduleAllProductJobs(): Promise<{ success: boolean; productsCount: number }>
```

### Programar Job Individual
```typescript
// Función interna
scheduleProductJob(productId: string, type: 'popularity' | 'featured' | 'classification'): Promise<boolean>
```

### Obtener Estadísticas de Colas
```typescript
// Función interna
getQueueStats(): Promise<QueueStats>
```

### Limpiar Colas
```typescript
// Función interna
cleanQueues(): Promise<void>
```

### Pausar/Reanudar Procesamiento
```typescript
// Funciones internas
pauseAllQueues(): Promise<void>
resumeAllQueues(): Promise<void>
```

---

## ⏰ Cron Jobs

### Cálculo Diario de Popularidad
```
POST /api/cron/popularity
```
**Autenticación:** Requiere token secreto en header
**Header:**
```
Authorization: Bearer {CRON_SECRET_TOKEN}
```

**Descripción:** Ejecuta cálculos automáticos de popularidad
**Funcionalidades:**
- Reset de contadores periódicos
- Cálculo de scores de popularidad
- Cálculo de scores de productos destacados
- Clasificación automática de productos
- Limpieza de datos antiguos

### Testing Manual (Solo Desarrollo)
```
GET /api/cron/popularity
```
**Descripción:** Ejecutar cálculos manualmente en desarrollo
**Restricción:** Solo disponible en `NODE_ENV !== 'production'`

---

## 🛒 Carrito

### Estado Actual
El módulo de carrito está en desarrollo. Se planea implementar:
- Gestión de carrito de compras
- Procesamiento de órdenes
- Integración con métodos de pago
- Historial de compras

---

## 🔒 Seguridad y Autenticación

### Roles de Usuario
- **CLIENTE**: Acceso básico a productos y categorías
- **ADMIN**: Gestión de productos, categorías e imágenes
- **SUPERADMIN**: Acceso completo al sistema

### Middleware de Autenticación
- Verificación de sesión activa
- Validación de roles para endpoints administrativos
- Protección CSRF mediante NextAuth
- Rate limiting implícito

### Headers de Seguridad
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN} // Para endpoints protegidos
```

---

## 📊 Respuestas de Error

### Formato Estándar de Error
```json
{
  "error": "string",
  "message": "string", // opcional
  "details": "object"  // opcional
}
```

### Códigos de Estado HTTP
- **200**: Operación exitosa
- **201**: Recurso creado
- **400**: Error de validación
- **401**: No autorizado
- **403**: Permisos insuficientes
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

---

## 🚀 Optimizaciones y Performance

### Caching
- Imágenes servidas con headers de cache apropiados
- Respuestas de productos con cache de 5 minutos
- Categorías con cache de 10 minutos

### Paginación
- Soporte para `limit` en endpoints de productos
- Ordenamiento por popularidad, fecha, precio
- Filtros por categoría y estado

### Base de Datos
- Uso de Prisma ORM para consultas optimizadas
- Índices en campos de búsqueda frecuente
- Soft deletes para mantener integridad referencial

---

## 🔧 Configuración del Entorno

### Variables de Entorno Requeridas
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
CRON_SECRET_TOKEN="..."
```

### Configuración de Base de Datos
- **Provider**: PostgreSQL
- **ORM**: Prisma
- **Migrations**: Automáticas en desarrollo
- **Seeding**: Datos de prueba incluidos

---

## 📝 Notas de Implementación

### Características Destacadas
- **Sistema de Popularidad**: Algoritmo de scoring basado en clicks y interacciones
- **Gestión de Imágenes**: Soporte para BLOB y URLs externas
- **Jobs Asíncronos**: Sistema de colas para procesamiento en background
- **Cron Jobs**: Automatización de tareas de mantenimiento

### Consideraciones Técnicas
- **Next.js 15**: App Router y Server Components
- **TypeScript**: Tipado estricto en toda la API
- **Prisma**: ORM moderno con migraciones automáticas
- **NextAuth.js**: Autenticación robusta y segura

### Monitoreo y Logs
- Logs estructurados para debugging
- Métricas de performance en endpoints críticos
- Alertas automáticas para errores del sistema
- Dashboard de administración para métricas en tiempo real 