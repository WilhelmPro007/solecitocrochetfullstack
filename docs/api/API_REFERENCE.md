# 📚 Referencia Completa de la API - Solecito Crochet

## 📋 Descripción General

Esta es la referencia completa de la API de Solecito Crochet. Contiene todos los endpoints disponibles, parámetros, respuestas y ejemplos de uso para cada funcionalidad del sistema.

---

## 🔗 Base URL

```
Desarrollo: http://localhost:3000
Producción: https://api.solecitocrochet.com
```

---

## 🔐 Autenticación

### Headers de Autenticación

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Tipos de Autenticación

| Tipo | Descripción | Endpoints |
|------|-------------|-----------|
| **Público** | No requiere autenticación | GET /api/products, GET /api/categories |
| **Cliente** | Usuario autenticado | POST /api/cart, GET /api/favorites |
| **Admin** | Administrador del sistema | POST /api/products, PUT /api/products |
| **SuperAdmin** | Super administrador | DELETE /api/users, configuración del sistema |

---

## 📊 Endpoints de Productos

### 1. GET /api/products

Obtiene una lista paginada de productos con filtros y ordenamiento.

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | integer | No | 1 | Número de página |
| `limit` | integer | No | 16 | Productos por página (máx. 100) |
| `category` | string | No | - | Filtrar por categoría (slug) |
| `active` | boolean | No | - | Solo productos activos |
| `featured` | boolean | No | - | Solo productos destacados |
| `sortBy` | string | No | createdAt | Campo de ordenamiento |
| `sortOrder` | string | No | desc | Dirección: asc o desc |

#### Respuesta Exitosa (200)

```json
{
  "products": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Amigurumi Conejito",
      "description": "Hermoso conejito tejido a crochet",
      "price": 29.99,
      "category": "amigurumis",
      "stock": 10,
      "isActive": true,
      "featured": false,
      "materials": "Hilo acrílico 100%",
      "dimensions": "15cm x 10cm",
      "weight": "150g",
      "careInstructions": "Lavar a mano, no usar secadora",
      "images": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "url": "/api/images/550e8400-e29b-41d4-a716-446655440001",
          "altText": "Vista frontal",
          "isMain": true,
          "order": 0
        }
      ],
      "popularity": {
        "popularityScore": 85.5,
        "featuredScore": 92.3,
        "isPopular": true,
        "isFeatured": true,
        "totalClicks": 150,
        "weeklyClicks": 25,
        "monthlyClicks": 80
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 80,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "limit": 16,
    "offset": 0
  }
}
```

#### Ejemplo de Uso

```bash
# Lista básica de productos
curl -X GET "https://api.solecitocrochet.com/api/products?page=1&limit=16"

# Productos destacados ordenados por precio
curl -X GET "https://api.solecitocrochet.com/api/products?featured=true&sortBy=price&sortOrder=asc"

# Productos de una categoría específica
curl -X GET "https://api.solecitocrochet.com/api/products?category=amigurumis&page=1&limit=12"
```

---

### 2. POST /api/products

Crea un nuevo producto. Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "Nuevo Amigurumi",
  "description": "Descripción del nuevo producto",
  "price": 24.99,
  "category": "amigurumis",
  "stock": 15,
  "materials": "Hilo de algodón",
  "dimensions": "20cm x 15cm",
  "weight": "200g",
  "careInstructions": "Lavar a mano"
}
```

#### Respuesta Exitosa (201)

```json
{
  "message": "Producto creado exitosamente",
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Nuevo Amigurumi",
    "description": "Descripción del nuevo producto",
    "price": 24.99,
    "category": "amigurumis",
    "stock": 15,
    "isActive": true,
    "featured": false,
    "materials": "Hilo de algodón",
    "dimensions": "20cm x 15cm",
    "weight": "200g",
    "careInstructions": "Lavar a mano",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### Respuesta de Error (400)

```json
{
  "error": "Datos de entrada inválidos",
  "details": [
    {
      "field": "name",
      "message": "El nombre es requerido"
    },
    {
      "field": "price",
      "message": "El precio debe ser un número positivo"
    }
  ]
}
```

---

### 3. GET /api/products/[id]

Obtiene un producto específico por su ID.

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único del producto |

#### Respuesta Exitosa (200)

```json
{
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Amigurumi Conejito",
    "description": "Hermoso conejito tejido a crochet",
    "price": 29.99,
    "category": "amigurumis",
    "stock": 10,
    "isActive": true,
    "featured": false,
    "materials": "Hilo acrílico 100%",
    "dimensions": "15cm x 10cm",
    "weight": "150g",
    "careInstructions": "Lavar a mano, no usar secadora",
    "images": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "url": "/api/images/550e8400-e29b-41d4-a716-446655440001",
        "altText": "Vista frontal",
        "isMain": true,
        "order": 0
      }
    ],
    "popularity": {
      "popularityScore": 85.5,
      "featuredScore": 92.3,
      "isPopular": true,
      "isFeatured": true,
      "totalClicks": 150,
      "weeklyClicks": 25,
      "monthlyClicks": 80,
      "whatsappClicks": 12,
      "favoriteClicks": 8
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### Respuesta de Error (404)

```json
{
  "error": "Producto no encontrado"
}
```

---

### 4. PUT /api/products/[id]

Actualiza un producto existente. Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único del producto |

#### Request Body

```json
{
  "name": "Amigurumi Conejito Actualizado",
  "price": 34.99,
  "stock": 20,
  "description": "Descripción actualizada del producto"
}
```

#### Respuesta Exitosa (200)

```json
{
  "message": "Producto actualizado exitosamente",
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Amigurumi Conejito Actualizado",
    "price": 34.99,
    "stock": 20,
    "description": "Descripción actualizada del producto",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### 5. DELETE /api/products/[id]

Elimina un producto (soft delete). Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único del producto |

#### Respuesta Exitosa (200)

```json
{
  "message": "Producto eliminado exitosamente"
}
```

---

### 6. GET /api/products/featured

Obtiene productos destacados automáticamente.

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `limit` | integer | No | 12 | Número de productos destacados |

#### Respuesta Exitosa (200)

```json
{
  "featuredProducts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Amigurumi Conejito",
      "price": 29.99,
      "category": "amigurumis",
      "featured": true,
      "featuredScore": 92.3,
      "images": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "url": "/api/images/550e8400-e29b-41d4-a716-446655440001",
          "altText": "Vista frontal",
          "isMain": true
        }
      ]
    }
  ],
  "total": 1
}
```

---

### 7. GET /api/products/popular

Obtiene productos populares automáticamente.

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `limit` | integer | No | 20 | Número de productos populares |

#### Respuesta Exitosa (200)

```json
{
  "popularProducts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Amigurumi Conejito",
      "price": 29.99,
      "category": "amigurumis",
      "popularity": {
        "popularityScore": 85.5,
        "isPopular": true,
        "totalClicks": 150,
        "weeklyClicks": 25,
        "monthlyClicks": 80
      },
      "images": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "url": "/api/images/550e8400-e29b-41d4-a716-446655440001",
          "altText": "Vista frontal",
          "isMain": true
        }
      ]
    }
  ],
  "total": 1
}
```

---

### 8. POST /api/products/[id]/track

Registra una interacción con un producto (click, favorito, WhatsApp).

#### Headers

```http
Content-Type: application/json
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único del producto |

#### Request Body

```json
{
  "clickType": "view",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "referrer": "https://google.com"
}
```

#### Tipos de Click

| Tipo | Descripción | Peso en Popularidad |
|------|-------------|---------------------|
| `view` | Vista del producto | 1.0 |
| `whatsapp` | Click en botón de WhatsApp | 3.0 |
| `favorite` | Agregar a favoritos | 1.5 |

#### Respuesta Exitosa (200)

```json
{
  "message": "Interacción registrada exitosamente",
  "tracking": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "clickType": "view",
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

---

## 📂 Endpoints de Categorías

### 1. GET /api/categories

Obtiene la lista de todas las categorías disponibles.

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `active` | boolean | No | - | Filtrar por estado activo |
| `custom` | boolean | No | - | Solo categorías personalizadas |
| `limit` | integer | No | 50 | Máximo de categorías a retornar |

#### Respuesta Exitosa (200)

```json
{
  "categories": [
    {
      "id": "cat-001",
      "name": "Amigurumis",
      "slug": "amigurumis",
      "icon": "🧸",
      "description": "Muñecos y figuras tejidas a crochet",
      "isActive": true,
      "isCustom": false,
      "productCount": 25,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "cat-002",
      "name": "Mantas y Cobijas",
      "slug": "mantas-cobijas",
      "icon": "🛏️",
      "description": "Mantas, cobijas y textiles para el hogar",
      "isActive": true,
      "isCustom": false,
      "productCount": 18,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 2,
  "active": 2,
  "custom": 0
}
```

---

### 2. GET /api/categories/[slug]

Obtiene una categoría específica por su slug.

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `slug` | string | Sí | Slug único de la categoría |

#### Respuesta Exitosa (200)

```json
{
  "category": {
    "id": "cat-001",
    "name": "Amigurumis",
    "slug": "amigurumis",
    "icon": "🧸",
    "description": "Muñecos y figuras tejidas a crochet",
    "isActive": true,
    "isCustom": false,
    "productCount": 25,
    "products": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Amigurumi Conejito",
        "price": 29.99,
        "images": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "url": "/api/images/550e8400-e29b-41d4-a716-446655440001",
            "altText": "Vista frontal",
            "isMain": true
          }
        ]
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### 3. POST /api/categories

Crea una nueva categoría personalizada. Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "Nueva Categoría",
  "slug": "nueva-categoria",
  "icon": "🌟",
  "description": "Descripción de la nueva categoría"
}
```

#### Respuesta Exitosa (201)

```json
{
  "message": "Categoría creada exitosamente",
  "category": {
    "id": "cat-003",
    "name": "Nueva Categoría",
    "slug": "nueva-categoria",
    "icon": "🌟",
    "description": "Descripción de la nueva categoría",
    "isActive": true,
    "isCustom": true,
    "productCount": 0,
    "createdAt": "2024-01-15T13:00:00Z",
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

---

### 4. PUT /api/categories/[id]

Actualiza una categoría existente. Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la categoría |

#### Request Body

```json
{
  "name": "Categoría Actualizada",
  "description": "Descripción actualizada",
  "icon": "✨"
}
```

#### Respuesta Exitosa (200)

```json
{
  "message": "Categoría actualizada exitosamente",
  "category": {
    "id": "cat-003",
    "name": "Categoría Actualizada",
    "description": "Descripción actualizada",
    "icon": "✨",
    "updatedAt": "2024-01-15T14:00:00Z"
  }
}
```

---

### 5. DELETE /api/categories/[id]

Elimina una categoría personalizada. Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la categoría |

#### Respuesta Exitosa (200)

```json
{
  "message": "Categoría eliminada exitosamente"
}
```

---

## 🖼️ Endpoints de Imágenes

### 1. POST /api/images

Sube una nueva imagen para un producto.

#### Headers

```http
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

#### Request Body (FormData)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `image` | File | Sí | Archivo de imagen (JPEG, PNG, WebP) |
| `productId` | string | Sí | ID del producto |
| `altText` | string | No | Texto alternativo de la imagen |
| `isMain` | boolean | No | Si es la imagen principal |

#### Respuesta Exitosa (201)

```json
{
  "message": "Imagen subida exitosamente",
  "image": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "productId": "550e8400-e29b-41d4-a716-446655440000",
    "altText": "Vista frontal del producto",
    "isMain": false,
    "order": 1,
    "mimeType": "image/jpeg",
    "filename": "producto.jpg",
    "fileSize": 245760,
    "createdAt": "2024-01-15T15:00:00Z"
  }
}
```

---

### 2. GET /api/images/[id]

Obtiene una imagen específica por su ID.

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la imagen |

#### Respuesta

- **Exitosa**: Imagen en formato binario con headers apropiados
- **Error 404**: JSON con mensaje de error

#### Headers de Respuesta

```http
Content-Type: image/jpeg
Cache-Control: public, max-age=31536000
Content-Length: 245760
```

---

### 3. PUT /api/images/[id]

Actualiza metadatos de una imagen. Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la imagen |

#### Request Body

```json
{
  "altText": "Nuevo texto alternativo",
  "isMain": true,
  "order": 0
}
```

#### Respuesta Exitosa (200)

```json
{
  "message": "Imagen actualizada exitosamente",
  "image": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "altText": "Nuevo texto alternativo",
    "isMain": true,
    "order": 0,
    "updatedAt": "2024-01-15T16:00:00Z"
  }
}
```

---

### 4. DELETE /api/images/[id]

Elimina una imagen. Requiere permisos de administrador.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la imagen |

#### Respuesta Exitosa (200)

```json
{
  "message": "Imagen eliminada exitosamente"
}
```

---

## 🔐 Endpoints de Autenticación

### 1. POST /api/auth/signin

Inicia sesión de un usuario existente.

#### Headers

```http
Content-Type: application/json
```

#### Request Body

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Respuesta Exitosa (200)

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "role": "CLIENTE"
  },
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires": "2024-12-31T23:59:59.999Z"
  }
}
```

---

### 2. POST /api/register

Registra un nuevo usuario.

#### Headers

```http
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "confirmPassword": "contraseña123",
  "role": "CLIENTE"
}
```

#### Respuesta Exitosa (201)

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "email": "nuevo@ejemplo.com",
    "role": "CLIENTE"
  }
}
```

---

### 3. POST /api/auth/signout

Cierra la sesión del usuario actual.

#### Headers

```http
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200)

```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### 4. GET /api/auth/session

Obtiene información de la sesión actual.

#### Headers

```http
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200)

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "role": "CLIENTE"
  },
  "expires": "2024-12-31T23:59:59.999Z"
}
```

---

## 🛠️ Endpoints de Administración

### 1. GET /api/admin/products

Obtiene estadísticas de productos para el dashboard administrativo.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Respuesta Exitosa (200)

```json
{
  "stats": {
    "totalProducts": 150,
    "activeProducts": 142,
    "featuredProducts": 23,
    "popularProducts": 30,
    "lowStockProducts": 8,
    "categories": [
      {
        "name": "Amigurumis",
        "count": 45,
        "percentage": 30
      },
      {
        "name": "Mantas y Cobijas",
        "count": 32,
        "percentage": 21.3
      }
    ]
  }
}
```

---

### 2. GET /api/admin/popularity

Obtiene métricas de popularidad para el dashboard.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Respuesta Exitosa (200)

```json
{
  "popularityMetrics": {
    "topProducts": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Amigurumi Conejito",
        "popularityScore": 85.5,
        "featuredScore": 92.3,
        "totalClicks": 150,
        "weeklyClicks": 25,
        "monthlyClicks": 80
      }
    ],
    "trendingCategories": [
      {
        "name": "Amigurumis",
        "totalClicks": 450,
        "growth": 15.5
      }
    ],
    "lastCalculated": "2024-01-15T06:00:00Z"
  }
}
```

---

### 3. GET /api/admin/jobs

Obtiene el estado de los jobs del sistema.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Respuesta Exitosa (200)

```json
{
  "jobs": [
    {
      "name": "popularity",
      "status": "running",
      "lastRun": "2024-01-15T06:00:00Z",
      "nextRun": "2024-01-16T06:00:00Z",
      "executionTime": 15000,
      "successCount": 150,
      "errorCount": 0
    }
  ],
  "schedulerStatus": "running"
}
```

---

### 4. POST /api/admin/jobs/[name]/trigger

Ejecuta manualmente un job específico.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `name` | string | Sí | Nombre del job (popularity, featured) |

#### Respuesta Exitosa (200)

```json
{
  "message": "Job ejecutado exitosamente",
  "job": {
    "name": "popularity",
    "status": "completed",
    "executionTime": 12000,
    "result": "150 productos procesados"
  }
}
```

---

## 📊 Endpoints de Estadísticas

### 1. GET /api/categories/stats

Obtiene estadísticas de categorías.

#### Respuesta Exitosa (200)

```json
{
  "categoryStats": [
    {
      "name": "Amigurumis",
      "productCount": 45,
      "totalViews": 1250,
      "averagePrice": 28.50,
      "popularity": 85.5
    },
    {
      "name": "Mantas y Cobijas",
      "productCount": 32,
      "totalViews": 890,
      "averagePrice": 45.75,
      "popularity": 72.3
    }
  ],
  "summary": {
    "totalCategories": 8,
    "totalProducts": 150,
    "averageProductsPerCategory": 18.75
  }
}
```

---

### 2. GET /api/admin/popularity

Obtiene métricas detalladas de popularidad.

#### Headers

```http
Authorization: Bearer <admin_token>
```

#### Respuesta Exitosa (200)

```json
{
  "popularityMetrics": {
    "systemStatus": {
      "lastCalculation": "2024-01-15T06:00:00Z",
      "nextCalculation": "2024-01-16T06:00:00Z",
      "calculationDuration": 15000
    },
    "topProducts": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Amigurumi Conejito",
        "popularityScore": 85.5,
        "featuredScore": 92.3,
        "isPopular": true,
        "isFeatured": true,
        "metrics": {
          "totalClicks": 150,
          "weeklyClicks": 25,
          "monthlyClicks": 80,
          "whatsappClicks": 12,
          "favoriteClicks": 8
        }
      }
    ],
    "trendingCategories": [
      {
        "name": "Amigurumis",
        "totalClicks": 450,
        "growth": 15.5,
        "topProducts": 3
      }
    ]
  }
}
```

---

## 🚨 Códigos de Error

### Códigos HTTP Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| **200** | OK | Request exitoso |
| **201** | Created | Recurso creado exitosamente |
| **400** | Bad Request | Datos de entrada inválidos |
| **401** | Unauthorized | Autenticación requerida |
| **403** | Forbidden | Permisos insuficientes |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: usuario duplicado) |
| **422** | Unprocessable Entity | Validación fallida |
| **500** | Internal Server Error | Error interno del servidor |

### Respuestas de Error Estándar

```json
{
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T12:00:00Z",
  "path": "/api/products",
  "details": [
    {
      "field": "name",
      "message": "El nombre es requerido"
    }
  ]
}
```

---

## 📱 Ejemplos de Uso por Lenguaje

### JavaScript/TypeScript

```typescript
class SolecitoCrochetAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'https://api.solecitocrochet.com') {
    this.baseUrl = baseUrl;
  }

  async login(email: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login fallido');
    }

    const data = await response.json();
    this.token = data.session.accessToken;
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });

    const response = await fetch(`${this.baseUrl}/api/products?${params}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
    });

    if (!response.ok) {
      throw new Error('Error obteniendo productos');
    }

    return response.json();
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    if (!this.token) throw new Error('No autenticado');

    const response = await fetch(`${this.baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error creando producto');
    }

    const data = await response.json();
    return data.product;
  }
}

// Uso
const api = new SolecitoCrochetAPI();
await api.login('admin@ejemplo.com', 'password123');

const products = await api.getProducts({ 
  category: 'amigurumis', 
  page: 1, 
  limit: 12 
});

const newProduct = await api.createProduct({
  name: 'Nuevo Amigurumi',
  price: 29.99,
  category: 'amigurumis',
  description: 'Descripción del producto'
});
```

### Python

```python
import requests
import json
from typing import Dict, Any, Optional

class SolecitoCrochetAPI:
    def __init__(self, base_url: str = "https://api.solecitocrochet.com"):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()

    def login(self, email: str, password: str) -> None:
        response = self.session.post(
            f"{self.base_url}/api/auth/signin",
            json={"email": email, "password": password}
        )
        
        if response.status_code != 200:
            raise Exception("Login fallido")
        
        data = response.json()
        self.token = data["session"]["accessToken"]
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})

    def get_products(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if filters is None:
            filters = {}
        
        response = self.session.get(
            f"{self.base_url}/api/products",
            params=filters
        )
        
        if response.status_code != 200:
            raise Exception("Error obteniendo productos")
        
        return response.json()

    def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.token:
            raise Exception("No autenticado")
        
        response = self.session.post(
            f"{self.base_url}/api/products",
            json=product_data
        )
        
        if response.status_code != 201:
            error = response.json()
            raise Exception(error.get("error", "Error creando producto"))
        
        data = response.json()
        return data["product"]

# Uso
api = SolecitoCrochetAPI()
api.login("admin@ejemplo.com", "password123")

products = api.get_products({
    "category": "amigurumis",
    "page": 1,
    "limit": 12
})

new_product = api.create_product({
    "name": "Nuevo Amigurumi",
    "price": 29.99,
    "category": "amigurumis",
    "description": "Descripción del producto"
})
```

### cURL

```bash
# Login
curl -X POST "https://api.solecitocrochet.com/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "password123"
  }'

# Obtener productos
curl -X GET "https://api.solecitocrochet.com/api/products?category=amigurumis&page=1&limit=12"

# Crear producto (requiere token)
curl -X POST "https://api.solecitocrochet.com/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Nuevo Amigurumi",
    "price": 29.99,
    "category": "amigurumis",
    "description": "Descripción del producto"
  }'

# Subir imagen
curl -X POST "https://api.solecitocrochet.com/api/images" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@producto.jpg" \
  -F "productId=PRODUCT_ID_HERE" \
  -F "altText=Vista frontal del producto"
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- [Guía del Desarrollador](./DEVELOPER_GUIDE.md) - Guía completa para desarrolladores
- [README Principal](./README.md) - Visión general de la API
- [Arquitectura](./architecture/README.md) - Documentación de arquitectura
- [Ejemplos de SDK](./SDK_EXAMPLES.md) - Ejemplos de implementación

### Herramientas de Desarrollo
- **Postman Collection**: Para testing de endpoints
- **Swagger UI**: Documentación interactiva
- **Insomnia**: Cliente REST alternativo
- **Thunder Client**: Extensión de VS Code

---

## 🎯 Conclusión

Esta referencia de la API proporciona toda la información necesaria para integrar y utilizar la API de Solecito Crochet. La API está diseñada para ser intuitiva, robusta y escalable, con un enfoque especial en la gestión de productos de crochet y artesanías.

### Características Destacadas
- **RESTful**: Diseño estándar y predecible
- **Autenticación JWT**: Seguridad robusta
- **Validación Completa**: Datos siempre válidos
- **Manejo de Errores**: Respuestas claras y útiles
- **Documentación Detallada**: Ejemplos y casos de uso

---

*Referencia de la API - Solecito Crochet v1.0.0*

**Última actualización**: Diciembre 2024  
**Versión de la API**: 1.0.0  
**Estado**: ✅ **PRODUCCIÓN READY**
