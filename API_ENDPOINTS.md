# 🔧 API Endpoints Técnicos - Solecito Crochet

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
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "clx1234567890abcdef",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "CLIENTE"
  }
}
```
**Respuesta de Error (400):**
```json
{
  "error": "Error de validación",
  "details": {
    "email": "El email ya está registrado"
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
- `category` (string, opcional): Filtrar por categoría específica
- `active` (boolean, opcional): Filtrar por estado activo
- `featured` (boolean, opcional): Filtrar productos destacados

**Ejemplos de URL:**
```
GET /api/products
GET /api/products?category=amigurumis
GET /api/products?active=true&featured=true
GET /api/products?category=amigurumis&active=true
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "clx1234567890abcdef",
    "name": "Amigurumi Conejito",
    "description": "Hermoso conejito tejido a crochet",
    "price": 25.99,
    "category": "amigurumis",
    "stock": 10,
    "isActive": true,
    "featured": true,
    "materials": "Hilo acrílico, relleno de poliéster",
    "dimensions": "15cm x 10cm",
    "weight": "150g",
    "careInstructions": "Lavar a mano, no usar secadora",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "images": [
      {
        "id": "img1234567890abcdef",
        "url": "/api/images/img1234567890abcdef",
        "altText": "Conejito amigurumi frontal",
        "isMain": true,
        "order": 0
      }
    ],
    "creator": {
      "id": "user1234567890abcdef",
      "name": "María González",
      "email": "maria@solecito.com"
    }
  }
]
```

### Crear Producto
```
POST /api/products
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```
**Body:**
```json
{
  "name": "Amigurumi Gatito",
  "description": "Adorable gatito tejido a crochet",
  "price": 30.50,
  "category": "amigurumis",
  "stock": 15,
  "featured": false,
  "materials": "Hilo de algodón, relleno hipoalergénico",
  "dimensions": "20cm x 12cm",
  "weight": "200g",
  "careInstructions": "Lavar a mano con agua fría",
  "images": [
    {
      "url": "https://example.com/gatito1.jpg",
      "altText": "Gatito amigurumi vista frontal",
      "isMain": true,
      "order": 0
    },
    {
      "url": "https://example.com/gatito2.jpg",
      "altText": "Gatito amigurumi vista lateral",
      "isMain": false,
      "order": 1
    }
  ]
}
```
**Respuesta Exitosa (201):**
```json
{
  "id": "clx1234567890abcdef",
  "name": "Amigurumi Gatito",
  "description": "Adorable gatito tejido a crochet",
  "price": 30.50,
  "category": "amigurumis",
  "stock": 15,
  "featured": false,
  "materials": "Hilo de algodón, relleno hipoalergénico",
  "dimensions": "20cm x 12cm",
  "weight": "200g",
  "careInstructions": "Lavar a mano con agua fría",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "images": [
    {
      "id": "img1234567890abcdef",
      "url": "https://example.com/gatito1.jpg",
      "altText": "Gatito amigurumi vista frontal",
      "isMain": true,
      "order": 0
    }
  ],
  "creator": {
    "id": "user1234567890abcdef",
    "name": "María González",
    "email": "maria@solecito.com"
  }
}
```

### Obtener Producto por ID
```
GET /api/products/[id]
```
**Path Parameters:**
- `id` (string): ID del producto (UUID)

**Ejemplo:**
```
GET /api/products/clx1234567890abcdef
```

**Respuesta Exitosa (200):**
```json
{
  "id": "clx1234567890abcdef",
  "name": "Amigurumi Conejito",
  "description": "Hermoso conejito tejido a crochet",
  "price": 25.99,
  "category": "amigurumis",
  "stock": 10,
  "isActive": true,
  "featured": true,
  "materials": "Hilo acrílico, relleno de poliéster",
  "dimensions": "15cm x 10cm",
  "weight": "150g",
  "careInstructions": "Lavar a mano, no usar secadora",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "images": [
    {
      "id": "img1234567890abcdef",
      "url": "/api/images/img1234567890abcdef",
      "altText": "Conejito amigurumi frontal",
      "isMain": true,
      "order": 0
    }
  ],
  "creator": {
    "id": "user1234567890abcdef",
    "name": "María González",
    "email": "maria@solecito.com"
  }
}
```

**Respuesta de Error (404):**
```json
{
  "error": "Producto no encontrado"
}
```

### Actualizar Producto
```
PUT /api/products/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID del producto (UUID)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

**Body:**
```json
{
  "name": "Amigurumi Conejito Grande",
  "description": "Hermoso conejito tejido a crochet - Tamaño grande",
  "price": 35.99,
  "category": "amigurumis",
  "stock": 8,
  "featured": true,
  "materials": "Hilo acrílico premium, relleno de poliéster",
  "dimensions": "25cm x 15cm",
  "weight": "250g",
  "careInstructions": "Lavar a mano con agua tibia, no usar secadora",
  "images": [
    {
      "url": "https://example.com/conejito-grande1.jpg",
      "altText": "Conejito grande amigurumi frontal",
      "isMain": true,
      "order": 0
    }
  ]
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": "clx1234567890abcdef",
  "name": "Amigurumi Conejito Grande",
  "description": "Hermoso conejito tejido a crochet - Tamaño grande",
  "price": 35.99,
  "category": "amigurumis",
  "stock": 8,
  "featured": true,
  "materials": "Hilo acrílico premium, relleno de poliéster",
  "dimensions": "25cm x 15cm",
  "weight": "250g",
  "careInstructions": "Lavar a mano con agua tibia, no usar secadora",
  "updatedAt": "2024-01-15T12:00:00Z",
  "images": [
    {
      "id": "img1234567890abcdef",
      "url": "https://example.com/conejito-grande1.jpg",
      "altText": "Conejito grande amigurumi frontal",
      "isMain": true,
      "order": 0
    }
  ]
}
```

### Eliminar Producto (Soft Delete)
```
DELETE /api/products/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID del producto (UUID)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200):**
```json
{
  "id": "clx1234567890abcdef",
  "name": "Amigurumi Conejito",
  "isActive": false,
  "updatedAt": "2024-01-15T13:00:00Z"
}
```

### Productos Destacados
```
GET /api/products/featured
```
**Query Parameters:**
- `limit` (number, opcional): Número máximo de productos (default: 6)
- `category` (string, opcional): Filtrar por categoría

**Ejemplos:**
```
GET /api/products/featured
GET /api/products/featured?limit=12
GET /api/products/featured?category=amigurumis&limit=8
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "clx1234567890abcdef",
    "name": "Amigurumi Conejito",
    "description": "Hermoso conejito tejido a crochet",
    "price": 25.99,
    "category": "amigurumis",
    "featured": true,
    "images": [
      {
        "id": "img1234567890abcdef",
        "url": "/api/images/img1234567890abcdef",
        "altText": "Conejito amigurumi frontal",
        "isMain": true,
        "order": 0
      }
    ],
    "popularity": {
      "popularityScore": 15.5,
      "totalClicks": 45,
      "weeklyClicks": 12,
      "monthlyClicks": 28
    },
    "creator": {
      "id": "user1234567890abcdef",
      "name": "María González",
      "email": "maria@solecito.com"
    }
  }
]
```

### Productos Populares
```
GET /api/products/popular
```
**Query Parameters:**
- `limit` (number, opcional): Número máximo de productos (default: 6)
- `category` (string, opcional): Filtrar por categoría

**Ejemplos:**
```
GET /api/products/popular
GET /api/products/popular?limit=10
GET /api/products/popular?category=amigurumis
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "clx1234567890abcdef",
    "name": "Amigurumi Conejito",
    "description": "Hermoso conejito tejido a crochet",
    "price": 25.99,
    "category": "amigurumis",
    "featured": true,
    "images": [
      {
        "id": "img1234567890abcdef",
        "url": "/api/images/img1234567890abcdef",
        "altText": "Conejito amigurumi frontal",
        "isMain": true,
        "order": 0
      }
    ],
    "popularity": {
      "popularityScore": 25.8,
      "totalClicks": 89,
      "weeklyClicks": 23,
      "monthlyClicks": 67
    },
    "creator": {
      "id": "user1234567890abcdef",
      "name": "María González",
      "email": "maria@solecito.com"
    }
  }
]
```

### Tracking de Productos
```
POST /api/products/[id]/track
```
**Path Parameters:**
- `id` (string): ID del producto (UUID)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "clickType": "view"
}
```

**Tipos de Click:**
- `"view"`: Visualización del producto
- `"whatsapp"`: Click en botón de WhatsApp
- `"favorite"`: Agregar a favoritos

**Ejemplo:**
```
POST /api/products/clx1234567890abcdef/track
Content-Type: application/json

{
  "clickType": "whatsapp"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true
}
```

**Headers de Tracking (Automáticos):**
```
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
x-forwarded-for: 192.168.1.100
x-real-ip: 192.168.1.100
referer: https://solecito.com/products
```

---

## 📂 Categorías

### Obtener Categorías
```
GET /api/categories
```
**Descripción:** Obtener todas las categorías con contador de productos

**Respuesta Exitosa (200):**
```json
{
  "categories": [
    {
      "id": "cat1234567890abcdef",
      "name": "Amigurumis",
      "slug": "amigurumis",
      "icon": "🐰",
      "description": "Animalitos tejidos a crochet",
      "isActive": true,
      "productCount": 25
    },
    {
      "id": "cat1234567890abcdef",
      "name": "Accesorios",
      "slug": "accesorios",
      "icon": "🎀",
      "description": "Accesorios y decoraciones",
      "isActive": true,
      "productCount": 18
    }
  ],
  "totalProducts": 43
}
```

### Crear Categoría
```
POST /api/categories
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

**Body:**
```json
{
  "name": "Mantas",
  "slug": "mantas",
  "icon": "🛏️",
  "description": "Mantas y cobijas tejidas a crochet",
  "isActive": true
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": "cat1234567890abcdef",
  "name": "Mantas",
  "slug": "mantas",
  "icon": "🛏️",
  "description": "Mantas y cobijas tejidas a crochet",
  "isActive": true,
  "createdAt": "2024-01-15T14:00:00Z",
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

### Actualizar Categoría
```
PUT /api/categories/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la categoría (UUID)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

**Body:**
```json
{
  "name": "Mantas y Cobijas",
  "icon": "🛏️",
  "description": "Mantas, cobijas y edredones tejidos a crochet"
}
```

### Eliminar Categoría
```
DELETE /api/categories/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la categoría (UUID)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 🖼️ Imágenes

### Subir Imagen
```
POST /api/images
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Body:** FormData
- `file` (File): Archivo de imagen (JPEG, PNG, WebP)
- `type` (string): "product" o "category"
- `productId` (string, opcional): ID del producto
- `categoryName` (string, opcional): Nombre de la categoría
- `altText` (string, opcional): Texto alternativo
- `isMain` (boolean, opcional): Si es imagen principal
- `order` (number, opcional): Orden de la imagen

**Restricciones:**
- **Tipos permitidos:** JPEG, JPG, PNG, WebP
- **Tamaño máximo:** 5MB
- **Resolución:** Sin límite específico

**Ejemplo para Producto:**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('type', 'product');
formData.append('productId', 'clx1234567890abcdef');
formData.append('altText', 'Vista frontal del producto');
formData.append('isMain', 'true');
formData.append('order', '0');
```

**Ejemplo para Categoría:**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('type', 'category');
formData.append('categoryName', 'amigurumis');
formData.append('altText', 'Icono de amigurumis');
```

**Respuesta Exitosa para Producto (200):**
```json
{
  "id": "img1234567890abcdef",
  "productId": "clx1234567890abcdef",
  "message": "Imagen de producto creada"
}
```

**Respuesta Exitosa para Categoría (200):**
```json
{
  "id": "img1234567890abcdef",
  "name": "amigurumis",
  "message": "Imagen de categoría creada"
}
```

**Respuesta de Error (400):**
```json
{
  "error": "Tipo de archivo no válido. Solo se permiten: JPEG, PNG, WebP"
}
```

**Respuesta de Error (400):**
```json
{
  "error": "El archivo es demasiado grande. Máximo 5MB"
}
```

### Obtener Imagen
```
GET /api/images/[id]
```
**Path Parameters:**
- `id` (string): ID de la imagen (UUID)

**Respuesta:** Archivo de imagen con headers apropiados
```
Content-Type: image/jpeg
Content-Length: 123456
Cache-Control: public, max-age=31536000
```

### Actualizar Imagen
```
PUT /api/images/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la imagen (UUID)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

**Body:**
```json
{
  "altText": "Nuevo texto alternativo",
  "isMain": true,
  "order": 1
}
```

### Eliminar Imagen
```
DELETE /api/images/[id]
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Path Parameters:**
- `id` (string): ID de la imagen (UUID)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

---

## ⚙️ Administración

### Estadísticas de Jobs
```
GET /api/admin/jobs
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Query Parameters:**
- `action` (string): "stats" o "status"

**Ejemplos:**
```
GET /api/admin/jobs?action=stats
GET /api/admin/jobs?action=status
```

**Respuesta para `action=stats` (200):**
```json
{
  "popularityQueue": 15,
  "featuredQueue": 8,
  "classificationQueue": 12,
  "isRunning": true,
  "isPaused": false,
  "lastProcessed": "2024-01-15T14:30:00Z"
}
```

**Respuesta para `action=status` (200):**
```json
{
  "timestamp": "2024-01-15T14:30:00Z",
  "scheduler": "active",
  "queues": {
    "popularityQueue": 15,
    "featuredQueue": 8,
    "classificationQueue": 12,
    "isRunning": true,
    "isPaused": false
  }
}
```

### Control de Jobs
```
POST /api/admin/jobs
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

**Body:**
```json
{
  "action": "schedule-all"
}
```

**Acciones Disponibles:**
- `"schedule-all"`: Programar jobs para todos los productos
- `"schedule-product"`: Programar jobs para un producto específico
- `"clean"`: Limpiar todas las colas
- `"pause"`: Pausar todas las colas
- `"resume"`: Reanudar todas las colas
- `"start"`: Iniciar procesamiento
- `"stop"`: Detener procesamiento
- `"daily-calculation"`: Ejecutar cálculo diario
- `"get-jobs"`: Obtener jobs de una cola específica

**Ejemplo para Producto Específico:**
```json
{
  "action": "schedule-product",
  "productId": "clx1234567890abcdef",
  "type": "popularity"
}
```

**Ejemplo para Obtener Jobs:**
```json
{
  "action": "get-jobs",
  "type": "popularity"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Jobs programados para 25 productos",
  "result": {
    "success": true,
    "productsCount": 25,
    "queues": {
      "popularity": 25,
      "featured": 25,
      "classification": 25
    }
  }
}
```

### Gestión de Popularidad
```
GET /api/admin/popularity
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Descripción:** Obtener métricas de popularidad del sistema

```
POST /api/admin/popularity
```
**Autenticación:** Requiere ADMIN o SUPERADMIN
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

**Descripción:** Ejecutar cálculos de popularidad manualmente

---

## 🔄 Sistema de Jobs

### Programar Jobs para Todos los Productos
```typescript
// Función interna del sistema
scheduleAllProductJobs(): Promise<{ success: boolean; productsCount: number }>
```

**Retorna:**
```typescript
{
  success: boolean;
  productsCount: number;
  queues: {
    popularity: number;
    featured: number;
    classification: number;
  };
}
```

### Programar Job Individual
```typescript
// Función interna del sistema
scheduleProductJob(
  productId: string, 
  type: 'popularity' | 'featured' | 'classification'
): Promise<boolean>
```

**Parámetros:**
- `productId`: ID del producto (UUID)
- `type`: Tipo de job a programar

**Tipos de Job:**
- `popularity`: Cálculo de métricas de popularidad
- `featured`: Evaluación para productos destacados
- `classification`: Clasificación automática del producto

### Obtener Estadísticas de Colas
```typescript
// Función interna del sistema
getQueueStats(): Promise<QueueStats>
```

**Retorna:**
```typescript
interface QueueStats {
  popularityQueue: number;
  featuredQueue: number;
  classificationQueue: number;
  isRunning: boolean;
  isPaused: boolean;
  lastProcessed?: Date;
}
```

### Limpiar Colas
```typescript
// Función interna del sistema
cleanQueues(): Promise<void>
```

### Pausar/Reanudar Procesamiento
```typescript
// Funciones internas del sistema
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
**Headers:**
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

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cálculo diario ejecutado",
  "timestamp": "2024-01-15T15:00:00Z",
  "processedProducts": 25,
  "updatedScores": 18,
  "cleanedRecords": 5
}
```

### Testing Manual (Solo Desarrollo)
```
GET /api/cron/popularity
```
**Descripción:** Ejecutar cálculos manualmente en desarrollo
**Restricción:** Solo disponible en `NODE_ENV !== 'production'`

**Respuesta en Desarrollo (200):**
```json
{
  "success": true,
  "message": "Cálculo manual ejecutado",
  "environment": "development",
  "timestamp": "2024-01-15T15:00:00Z"
}
```

**Respuesta en Producción (404):**
```json
{
  "error": "Endpoint no disponible en producción"
}
```

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

### Validación de Permisos
```typescript
// Ejemplo de verificación de rol
if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
  return NextResponse.json(
    { error: 'Permisos insuficientes' },
    { status: 403 }
  );
}
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

### Ejemplos de Errores

**Error de Validación (400):**
```json
{
  "error": "Error de validación",
  "details": {
    "price": "El precio debe ser un número positivo",
    "category": "La categoría es requerida"
  }
}
```

**Error de Autenticación (401):**
```json
{
  "error": "No autorizado",
  "message": "Sesión expirada o inválida"
}
```

**Error de Permisos (403):**
```json
{
  "error": "Permisos insuficientes",
  "message": "Se requiere rol de ADMIN o SUPERADMIN"
}
```

**Error de Recurso (404):**
```json
{
  "error": "Producto no encontrado",
  "message": "El producto con ID especificado no existe"
}
```

**Error del Servidor (500):**
```json
{
  "error": "Error interno del servidor",
  "message": "Error al procesar la solicitud"
}
```

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

### Headers de Cache
```
Cache-Control: public, max-age=300 // 5 minutos para productos
Cache-Control: public, max-age=600 // 10 minutos para categorías
ETag: "abc123def456"
Last-Modified: Wed, 15 Jan 2024 15:00:00 GMT
```

---

## 🔧 Configuración del Entorno

### Variables de Entorno Requeridas
```env
DATABASE_URL="postgresql://username:password@localhost:5432/solecito_crochet"
NEXTAUTH_SECRET="tu-secreto-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"
CRON_SECRET_TOKEN="token-secreto-para-cron-jobs"
```

### Configuración de Base de Datos
- **Provider**: PostgreSQL
- **ORM**: Prisma
- **Migrations**: Automáticas en desarrollo
- **Seeding**: Datos de prueba incluidos

### Configuración de NextAuth
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Configuración de credenciales
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // Lógica de JWT
    },
    session: ({ session, token }) => {
      // Lógica de sesión
    }
  }
};
```

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

### Estructura de Base de Datos
```sql
-- Tabla de productos
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "category" TEXT NOT NULL,
  "stock" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "featured" BOOLEAN DEFAULT false,
  "createdBy" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de métricas de popularidad
CREATE TABLE "PopularityMetric" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "popularityScore" DECIMAL(5,2) DEFAULT 0,
  "totalClicks" INTEGER DEFAULT 0,
  "weeklyClicks" INTEGER DEFAULT 0,
  "monthlyClicks" INTEGER DEFAULT 0,
  "yearlyClicks" INTEGER DEFAULT 0,
  "lastCalculated" DATETIME NOT NULL
);
``` 