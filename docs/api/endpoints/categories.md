# 📂 Categorías API - Solecito Crochet

## 📋 Descripción General

La API de Categorías permite gestionar tanto categorías predefinidas del sistema como categorías personalizadas creadas por administradores. El sistema implementa un enfoque híbrido que combina categorías estáticas para funcionalidad básica con categorías dinámicas para flexibilidad.

## 🔐 Autenticación

- **Lectura**: No requiere autenticación
- **Escritura**: Requiere rol ADMIN o SUPERADMIN
- **Eliminación**: Requiere rol ADMIN o SUPERADMIN

## 📡 Endpoints Disponibles

### 1. GET /api/categories

Obtiene la lista de todas las categorías disponibles.

#### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `active` | boolean | No | - | Filtrar por estado activo |
| `custom` | boolean | No | - | Solo categorías personalizadas |
| `limit` | integer | No | 50 | Máximo de categorías a retornar |

#### Ejemplo de Request

```bash
# Obtener todas las categorías
curl -X GET "https://api.solecitocrochet.com/api/categories"

# Solo categorías activas
curl -X GET "https://api.solecitocrochet.com/api/categories?active=true"

# Solo categorías personalizadas
curl -X GET "https://api.solecitocrochet.com/api/categories?custom=true"
```

#### Ejemplo de Response

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

### 2. GET /api/categories/[slug]

Obtiene una categoría específica por su slug.

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `slug` | string | Sí | Slug único de la categoría |

#### Ejemplo de Request

```bash
curl -X GET "https://api.solecitocrochet.com/api/categories/amigurumis"
```

#### Ejemplo de Response

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
        "id": "prod-001",
        "name": "Gatito Amigurumi",
        "price": 35.99,
        "featured": true,
        "isActive": true
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 3. POST /api/categories

Crea una nueva categoría personalizada.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Body del Request

```json
{
  "name": "Accesorios para Bebés",
  "slug": "accesorios-bebes",
  "icon": "👶",
  "description": "Gorros, zapatitos y accesorios para bebés"
}
```

#### Validaciones

| Campo | Tipo | Requerido | Reglas |
|-------|------|-----------|--------|
| `name` | string | Sí | 3-100 caracteres, único |
| `slug` | string | Sí | 3-50 caracteres, solo letras, números y guiones |
| `icon` | string | Sí | Emoji o icono válido |
| `description` | string | No | Máximo 500 caracteres |

#### Ejemplo de Request

```bash
curl -X POST "https://api.solecitocrochet.com/api/categories" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accesorios para Bebés",
    "slug": "accesorios-bebes",
    "icon": "👶",
    "description": "Gorros, zapatitos y accesorios para bebés"
  }'
```

#### Ejemplo de Response

```json
{
  "category": {
    "id": "cat-003",
    "name": "Accesorios para Bebés",
    "slug": "accesorios-bebes",
    "icon": "👶",
    "description": "Gorros, zapatitos y accesorios para bebés",
    "isActive": true,
    "isCustom": true,
    "productCount": 0,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Categoría creada exitosamente"
}
```

### 4. PUT /api/categories/[id]

Actualiza una categoría existente.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la categoría |

#### Body del Request

```json
{
  "name": "Accesorios para Bebés y Niños",
  "description": "Gorros, zapatitos y accesorios para bebés y niños pequeños",
  "icon": "👶",
  "isActive": true
}
```

#### Ejemplo de Request

```bash
curl -X PUT "https://api.solecitocrochet.com/api/categories/cat-003" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accesorios para Bebés y Niños",
    "description": "Gorros, zapatitos y accesorios para bebés y niños pequeños",
    "icon": "👶",
    "isActive": true
  }'
```

#### Ejemplo de Response

```json
{
  "category": {
    "id": "cat-003",
    "name": "Accesorios para Bebés y Niños",
    "slug": "accesorios-bebes",
    "icon": "👶",
    "description": "Gorros, zapatitos y accesorios para bebés y niños pequeños",
    "isActive": true,
    "isCustom": true,
    "productCount": 0,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:30:00Z"
  },
  "message": "Categoría actualizada exitosamente"
}
```

### 5. DELETE /api/categories/[id]

Elimina una categoría personalizada.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la categoría |

#### Validaciones

- Solo se pueden eliminar categorías personalizadas (`isCustom: true`)
- La categoría no debe tener productos asociados
- Requiere rol ADMIN o SUPERADMIN

#### Ejemplo de Request

```bash
curl -X DELETE "https://api.solecitocrochet.com/api/categories/cat-003" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Ejemplo de Response

```json
{
  "message": "Categoría eliminada exitosamente",
  "deletedCategory": {
    "id": "cat-003",
    "name": "Accesorios para Bebés y Niños",
    "slug": "accesorios-bebes"
  }
}
```

## 🏗️ Sistema de Categorías Híbrido

### Categorías Predefinidas

El sistema incluye categorías estáticas que no se pueden modificar:

| Categoría | Slug | Icono | Descripción |
|-----------|------|-------|-------------|
| Amigurumis | `amigurumis` | 🧸 | Muñecos y figuras tejidas |
| Mantas y Cobijas | `mantas-cobijas` | 🛏️ | Textiles para el hogar |
| Accesorios | `accesorios` | 🎀 | Complementos y adornos |
| Ropa | `ropa` | 👕 | Prendas tejidas |
| Decoración | `decoracion` | 🏠 | Elementos decorativos |

### Categorías Personalizadas

Los administradores pueden crear categorías adicionales con:

- **Nombres únicos** y descriptivos
- **Slugs personalizados** para URLs amigables
- **Iconos** (emojis o símbolos)
- **Descripciones** opcionales

## 🔍 Filtros y Búsqueda

### Filtros Disponibles

```bash
# Por estado
GET /api/categories?active=true

# Solo personalizadas
GET /api/categories?custom=true

# Combinar filtros
GET /api/categories?active=true&custom=true

# Limitar resultados
GET /api/categories?limit=10
```

### Búsqueda por Nombre

```bash
# Buscar categorías que contengan "bebé"
GET /api/categories?search=bebe
```

## 📊 Estadísticas de Categorías

### Endpoint de Estadísticas

```bash
GET /api/admin/categories/stats
```

### Métricas Disponibles

- **Total de categorías** (predefinidas + personalizadas)
- **Productos por categoría**
- **Valor total** de productos por categoría
- **Precio promedio** por categoría
- **Productos destacados** por categoría
- **Crecimiento** en el tiempo

## 🚨 Manejo de Errores

### Códigos de Error Comunes

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `CATEGORY_NOT_FOUND` | 404 | Categoría no encontrada |
| `CATEGORY_IN_USE` | 400 | Categoría tiene productos asociados |
| `DUPLICATE_SLUG` | 409 | Slug ya existe |
| `INVALID_ICON` | 400 | Icono no válido |
| `UNAUTHORIZED` | 401 | Token faltante o inválido |
| `FORBIDDEN` | 403 | Permisos insuficientes |

### Ejemplo de Error Response

```json
{
  "error": {
    "code": "CATEGORY_IN_USE",
    "message": "No se puede eliminar la categoría porque tiene productos asociados",
    "details": {
      "productCount": 5,
      "categoryId": "cat-001"
    }
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## 🔄 Operaciones en Lote

### Actualizar Múltiples Categorías

```bash
PUT /api/categories/batch
```

```json
{
  "updates": [
    {
      "id": "cat-001",
      "isActive": false
    },
    {
      "id": "cat-002",
      "icon": "🌟"
    }
  ]
}
```

## 📈 Mejores Prácticas

### Para Desarrolladores

1. **Usar slugs descriptivos** para URLs amigables
2. **Validar iconos** antes de enviar
3. **Manejar estados** de categorías correctamente
4. **Implementar caché** para categorías frecuentemente consultadas

### Para Administradores

1. **Crear categorías específicas** para mejor organización
2. **Usar nombres claros** y descriptivos
3. **Mantener consistencia** en el uso de iconos
4. **Revisar estadísticas** regularmente

## 🔗 Endpoints Relacionados

- **[📦 Productos](./products.md)** - Gestión de productos por categoría
- **[🖼️ Imágenes](./images.md)** - Imágenes de categorías
- **[📊 Estadísticas Admin](./../admin.md)** - Métricas y reportes
- **[🏗️ Arquitectura](./../architecture/README.md)** - Diseño del sistema

---

*📂 Sistema de categorías híbrido para máxima flexibilidad y organización*
