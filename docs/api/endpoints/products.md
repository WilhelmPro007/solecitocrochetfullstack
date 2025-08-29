# 🔧 API Endpoints - Products (v1.0.0)

## Descripción General

Los endpoints de productos permiten gestionar el catálogo completo de productos de crochet. Incluye operaciones CRUD completas, filtrado avanzado, paginación, y sistema de tracking de interacciones.

---

## 📋 GET /api/products

Obtiene una lista paginada de productos con filtros y ordenamiento avanzado.

### 🔐 Autenticación
- **Requerida**: No (público)
- **Headers**: Ninguno requerido

### 📝 Query Parameters

#### Paginación
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| page | integer | No | 1 | Número de página |
| limit | integer | No | 16 | Productos por página (máx. 100) |

#### Filtros
| Parámetro | Tipo | Requerido | Valores | Descripción |
|-----------|------|-----------|---------|-------------|
| category | string | No | any | Filtrar por categoría (slug) |
| active | boolean | No | - | Solo productos activos |
| featured | boolean | No | - | Solo productos destacados |

#### Ordenamiento
| Parámetro | Tipo | Requerido | Valores | Descripción |
|-----------|------|-----------|---------|-------------|
| sortBy | string | No | createdAt | Campo de ordenamiento |
| sortOrder | string | No | desc | Dirección: asc o desc |

### 📤 Respuesta Exitosa (200)

`json
{
  \"products\": [
    {
      \"id\": \"550e8400-e29b-41d4-a716-446655440000\",
      \"name\": \"Amigurumi Conejito\",
      \"price\": 29.99,
      \"category\": \"amigurumis\",
      \"stock\": 10,
      \"isActive\": true,
      \"featured\": false,
      \"images\": [
        {
          \"id\": \"550e8400-e29b-41d4-a716-446655440001\",
          \"url\": \"/api/images/550e8400-e29b-41d4-a716-446655440001\",
          \"altText\": \"Vista frontal\",
          \"isMain\": true,
          \"order\": 0
        }
      ]
    }
  ],
  \"pagination\": {
    \"currentPage\": 1,
    \"totalPages\": 5,
    \"totalProducts\": 80,
    \"hasNextPage\": true,
    \"hasPreviousPage\": false,
    \"limit\": 16,
    \"offset\": 0
  }
}
`

### 💡 Ejemplos de Uso

#### JavaScript/TypeScript
`javascript
// Obtener productos destacados
const response = await fetch('/api/products?featured=true&page=1&limit=12');
const data = await response.json();
`

#### cURL
`ash
# Lista básica de productos
curl -X GET \"https://api.solecitocrochet.com/api/products?page=1&limit=16\"

# Productos destacados ordenados por precio
curl -X GET \"https://api.solecitocrochet.com/api/products?featured=true&sortBy=price&sortOrder=asc\"
`

---

## 📋 POST /api/products

Crea un nuevo producto. Requiere permisos de administrador.

### 🔐 Autenticación
- **Requerida**: Sí
- **Headers**: 
  `
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  `

### 📝 Body Parameters

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | Sí | Nombre del producto (máx. 255 chars) |
| price | number | Sí | Precio en USD (mín. 0.01) |
| category | string | Sí | Slug de la categoría |
| stock | integer | No | Cantidad en inventario (default: 0) |
| featured | boolean | No | Producto destacado (default: false) |
| materials | string | No | Materiales utilizados |
| description | string | No | Descripción detallada |
| images | array | No | Lista de imágenes |

### 📤 Ejemplo Request

`ash
curl -X POST \"https://api.solecitocrochet.com/api/products\" \\
  -H \"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\" \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"name\": \"Amigurumi Gato\",
    \"price\": 35.50,
    \"category\": \"amigurumis\",
    \"stock\": 8,
    \"featured\": true,
    \"materials\": \"Hilo acrílico premium\",
    \"description\": \"Hermoso gato tejido a crochet\"
  }'
`

---

## 📋 GET /api/products/{id}

Obtiene detalles de un producto específico.

### 📝 Path Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| id | string | Sí | UUID del producto |

---

## 📋 PUT /api/products/{id}

Actualiza un producto existente. Requiere permisos de administrador.

### 📝 Body Parameters (todos opcionales)
`json
{
  \"name\": \"Nuevo nombre\",
  \"price\": 39.99,
  \"stock\": 5,
  \"featured\": true
}
`

---

## 📋 DELETE /api/products/{id}

Realiza soft delete del producto.

---

## 📋 GET /api/products/featured

Obtiene productos destacados.

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| limit | integer | 6 | Número máximo de productos |
| category | string | - | Filtrar por categoría |

---

## 📋 GET /api/products/popular

Obtiene productos populares por métricas de interacción.

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| limit | integer | 6 | Número máximo de productos |
| category | string | - | Filtrar por categoría |

---

## 📋 POST /api/products/{id}/track

Registra interacción del usuario con un producto.

### 📝 Body Parameters
| Campo | Tipo | Requerido | Valores |
|-------|------|-----------|---------|
| clickType | string | Sí | view, whatsapp, favorite |

---

## 🚨 Códigos de Error

### 400 Bad Request
`json
{
  \"error\": \"Parámetros inválidos\",
  \"message\": \"El límite máximo es 100 productos por página\"
}
`

### 401 Unauthorized
`json
{
  \"error\": \"No autorizado\",
  \"message\": \"Token de autenticación requerido\"
}
`

### 403 Forbidden
`json
{
  \"error\": \"Permisos insuficientes\",
  \"message\": \"Se requiere rol de ADMIN o SUPERADMIN\"
}
`

### 404 Not Found
`json
{
  \"error\": \"Producto no encontrado\"
}
`

### 500 Internal Server Error
`json
{
  \"error\": \"Error interno del servidor\"
}
`

---

## 📊 Especificaciones Técnicas

### Límites
- Productos por página: máximo 100
- Precio mínimo: 0.01 USD
- Longitud nombre: máximo 255 caracteres

### Rate Limiting
- Sin autenticación: 100 requests/min por IP
- Con autenticación: 1000 requests/min por usuario

### Headers de Caché
`
Cache-Control: public, max-age=300
ETag: \"550e8400-e29b-41d4-a716-446655440000\"
`

---

## 📞 Contacto

- **Email**: soporte@solecitocrochet.com
- **Versión API**: 1.0.0
