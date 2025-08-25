# API Endpoints - Solecito Crochet

## Productos

### GET /api/products
Obtiene todos los productos con paginación avanzada, filtros y ordenamiento.

**Parámetros de consulta:**

#### Paginación
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Productos por página (por defecto: 16, máximo: 100)

#### Filtros
- `category` (opcional): ID de la categoría o 'all' para todas las categorías
- `active` (opcional): 'true' o 'false' para filtrar por estado activo
- `featured` (opcional): 'true' o 'false' para filtrar productos destacados

#### Ordenamiento
- `sortBy` (opcional): Campo para ordenar
  - `price`: Ordenar por precio
  - `name`: Ordenar por nombre
  - `createdAt`: Ordenar por fecha de creación (por defecto)
- `sortOrder` (opcional): Dirección del ordenamiento
  - `asc`: Ascendente (A-Z, menor a mayor)
  - `desc`: Descendente (Z-A, mayor a menor, por defecto)

**Ejemplo de respuesta exitosa:**
```json
{
  "products": [
    {
      "id": "uuid-del-producto",
      "name": "Amigurumi Conejito",
      "description": "Hermoso conejito tejido a mano con hilo de algodón premium",
      "price": 29.99,
      "category": "amigurumis",
      "stock": 10,
      "isActive": true,
      "featured": false,
      "materials": "Hilo de algodón 100%, relleno de poliéster",
      "dimensions": "20cm x 15cm",
      "weight": "100g",
      "careInstructions": "Lavar a mano con agua fría, no usar secadora",
      "images": [
        {
          "id": "uuid-imagen",
          "url": "/api/images/uuid-imagen",
          "altText": "Conejito amigurumi vista frontal",
          "isMain": true,
          "order": 0
        }
      ],
      "creator": {
        "id": "uuid-creador",
        "name": "María González",
        "email": "maria@solecitocrochet.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
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

**Ejemplos de uso:**

```bash
# Página básica con 16 productos
GET /api/products?page=1&limit=16

# Productos de una categoría específica
GET /api/products?category=amigurumis&page=1&limit=12

# Ordenar por precio de menor a mayor
GET /api/products?sortBy=price&sortOrder=asc&page=1&limit=24

# Solo productos activos y destacados
GET /api/products?active=true&featured=true&page=1&limit=8

# Ordenar por nombre alfabéticamente
GET /api/products?sortBy=name&sortOrder=asc&page=2&limit=20

# Combinación de filtros y ordenamiento
GET /api/products?category=accesorios&active=true&sortBy=createdAt&sortOrder=desc&page=1&limit=16
```

**Respuestas de error:**

```json
// Error 500 - Error interno del servidor
{
  "error": "Error al obtener productos"
}

// Error 400 - Parámetros inválidos (cuando se implemente validación)
{
  "error": "Parámetros de paginación inválidos",
  "details": "El límite máximo es 100 productos por página"
}
```

**Notas importantes:**

1. **Límites de paginación**: 
   - Página mínima: 1
   - Límite mínimo: 1
   - Límite máximo: 100 productos por página

2. **Ordenamiento por defecto**: 
   - Si no se especifica `sortBy`, se ordena por `createdAt`
   - Si no se especifica `sortOrder`, se usa `desc` (más recientes primero)

3. **Filtros combinados**: 
   - Los filtros se aplican usando operadores AND
   - Se pueden combinar múltiples filtros en una sola consulta

4. **Metadatos de paginación**:
   - `currentPage`: Página actual
   - `totalPages`: Total de páginas disponibles
   - `totalProducts`: Total de productos que coinciden con los filtros
   - `hasNextPage`: Indica si hay una página siguiente
   - `hasPreviousPage`: Indica si hay una página anterior
   - `limit`: Productos por página
   - `offset`: Desplazamiento desde el primer producto

5. **Performance**:
   - La API usa `skip` y `take` de Prisma para paginación eficiente
   - Solo se cuentan los productos totales cuando es necesario
   - Las consultas incluyen solo los campos necesarios

### GET /api/products/popular
Obtiene productos populares basados en métricas de popularidad.

**Parámetros de consulta:**
- `limit` (opcional): Número máximo de productos (por defecto: 6)
- `category` (opcional): ID de la categoría o 'all' para todas

**Ejemplo de respuesta:**
```json
[
  {
    "id": "uuid",
    "name": "Producto Popular",
    "price": 25.99,
    "category": "amigurumis",
    "images": [...],
    "popularity": {
      "popularityScore": 15.5,
      "totalClicks": 45,
      "weeklyClicks": 12,
      "monthlyClicks": 28
    }
  }
]
```

### GET /api/products/featured
Obtiene productos destacados.

**Parámetros de consulta:**
- `limit` (opcional): Número máximo de productos (por defecto: 6)
- `category` (opcional): ID de la categoría o 'all' para todas

**Ejemplo de respuesta:**
```json
[
  {
    "id": "uuid",
    "name": "Producto Destacado",
    "price": 35.99,
    "category": "accesorios",
    "featured": true,
    "images": [...]
  }
]
```

### GET /api/products/[id]
Obtiene un producto específico por ID.

**Parámetros de ruta:**
- `id`: UUID del producto

**Ejemplo de respuesta:**
```json
{
  "id": "uuid-del-producto",
  "name": "Amigurumi Conejito",
  "description": "Descripción completa del producto",
  "price": 29.99,
  "category": "amigurumis",
  "stock": 10,
  "isActive": true,
  "featured": false,
  "images": [...],
  "creator": {...},
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### POST /api/products
Crea un nuevo producto (requiere autenticación de admin).

**Headers requeridos:**
```
Authorization: Bearer [token]
Content-Type: application/json
```

**Cuerpo de la petición:**
```json
{
  "name": "Nombre del producto",
  "description": "Descripción detallada del producto",
  "price": 29.99,
  "category": "amigurumis",
  "stock": 10,
  "featured": false,
  "materials": "Hilo de algodón 100%, relleno de poliéster",
  "dimensions": "20cm x 15cm",
  "weight": "100g",
  "careInstructions": "Lavar a mano con agua fría, no usar secadora",
  "images": [
    {
      "url": "https://ejemplo.com/imagen.jpg",
      "altText": "Descripción de la imagen"
    }
  ]
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "uuid-generado",
  "name": "Nombre del producto",
  "price": 29.99,
  "category": "amigurumis",
  "createdAt": "2024-01-15T10:30:00Z",
  "images": [...],
  "creator": {...}
}
```

**Respuestas de error:**
```json
// Error 401 - No autorizado
{
  "error": "No autorizado"
}

// Error 403 - Permisos insuficientes
{
  "error": "Permisos insuficientes"
}

// Error 500 - Error interno
{
  "error": "Error al crear producto"
}
```

## Categorías

### GET /api/categories
Obtiene todas las categorías con contador de productos.

**Respuesta:**
```json
{
  "categories": [
    {
      "id": "uuid-categoria",
      "name": "Amigurumis",
      "icon": "🧸",
      "productCount": 25
    }
  ],
  "totalProducts": 80
}
```

## Imágenes

### GET /api/images
Obtiene todas las imágenes.

### GET /api/images/[id]
Obtiene una imagen específica por ID.

### POST /api/images
Sube una nueva imagen.

## Autenticación

### GET /api/auth/[...nextauth]
Endpoint de NextAuth para autenticación.

## Usuarios

### POST /api/register
Registra un nuevo usuario.

## Carrito

### GET /api/cart
Obtiene el carrito del usuario autenticado.

### POST /api/cart
Agrega un producto al carrito.

## Admin

### GET /api/admin/products
Obtiene productos para el panel de administración.

### GET /api/admin/users
Obtiene usuarios para el panel de administración.

### GET /api/admin/orders
Obtiene órdenes para el panel de administración.

### GET /api/admin/jobs
Obtiene trabajos programados.

### GET /api/admin/popularity
Obtiene métricas de popularidad.

## Cron Jobs

### GET /api/cron/popularity
Actualiza métricas de popularidad (ejecutado automáticamente).

## Notas de Implementación

### Paginación
- La paginación está implementada en la API principal de productos
- Los parámetros `page` y `limit` controlan la paginación
- La respuesta incluye metadatos completos de paginación
- El límite máximo por página es 100 productos por seguridad

### Ordenamiento
- Se puede ordenar por: precio, nombre, fecha de creación
- El orden por defecto es por fecha de creación (más recientes primero)
- Los parámetros `sortBy` y `sortOrder` controlan el ordenamiento

### Filtros
- Los filtros se aplican antes de la paginación
- Los filtros disponibles son: categoría, estado activo, destacados
- Los filtros se combinan usando operadores AND lógicos

### Performance
- Se utiliza `skip` y `take` de Prisma para paginación eficiente
- Se cuenta el total de productos solo cuando es necesario
- Las consultas incluyen solo los campos necesarios usando `select`
- Se optimiza el manejo de imágenes BLOB

### Seguridad
- Validación de parámetros de entrada
- Límites máximos para prevenir abuso
- Autenticación requerida para operaciones de escritura
- Validación de roles para operaciones administrativas 