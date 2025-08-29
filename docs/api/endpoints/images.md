# 🖼️ Imágenes API - Solecito Crochet

## 📋 Descripción General

La API de Imágenes permite gestionar el almacenamiento y distribución de imágenes para productos y categorías. El sistema soporta tanto almacenamiento BLOB en base de datos como URLs externas, proporcionando flexibilidad para diferentes casos de uso.

## 🔐 Autenticación

- **Lectura**: No requiere autenticación (imágenes públicas)
- **Escritura**: Requiere rol ADMIN o SUPERADMIN
- **Eliminación**: Requiere rol ADMIN o SUPERADMIN

## 📡 Endpoints Disponibles

### 1. POST /api/images

Sube una nueva imagen al sistema.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

#### Body del Request (FormData)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `file` | File | Sí | Archivo de imagen (JPG, PNG, WebP) |
| `altText` | string | No | Texto alternativo para accesibilidad |
| `isMain` | boolean | No | Si es imagen principal (default: false) |
| `order` | integer | No | Orden de visualización (default: 0) |
| `entityType` | string | Sí | Tipo de entidad: 'product' o 'category' |
| `entityId` | string | Sí | ID de la entidad asociada |

#### Tipos de Archivo Soportados

- **JPG/JPEG**: Máximo 10MB
- **PNG**: Máximo 10MB
- **WebP**: Máximo 10MB
- **GIF**: Máximo 5MB (solo para productos)

#### Ejemplo de Request

```bash
curl -X POST "https://api.solecitocrochet.com/api/images" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@gatito.jpg" \
  -F "altText=Gatito amigurumi tejido a mano" \
  -F "isMain=true" \
  -F "entityType=product" \
  -F "entityId=prod-001"
```

#### Ejemplo de Response

```json
{
  "image": {
    "id": "img-001",
    "url": "https://api.solecitocrochet.com/api/images/img-001",
    "altText": "Gatito amigurumi tejido a mano",
    "isMain": true,
    "order": 0,
    "mimeType": "image/jpeg",
    "fileSize": 245760,
    "filename": "gatito.jpg",
    "entityType": "product",
    "entityId": "prod-001",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "message": "Imagen subida exitosamente"
}
```

### 2. GET /api/images/[id]

Obtiene una imagen específica por su ID.

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la imagen |

#### Headers de Respuesta

La respuesta incluye headers HTTP para optimización:

```bash
Cache-Control: public, max-age=31536000
ETag: "abc123"
Last-Modified: Wed, 15 Jan 2024 10:00:00 GMT
Content-Type: image/jpeg
Content-Length: 245760
```

#### Ejemplo de Request

```bash
# Obtener imagen
curl -X GET "https://api.solecitocrochet.com/api/images/img-001"

# Con headers de caché
curl -X GET "https://api.solecitocrochet.com/api/images/img-001" \
  -H "If-None-Match: abc123"
```

#### Respuesta

- **200 OK**: Imagen binaria con headers apropiados
- **304 Not Modified**: Si la imagen no ha cambiado
- **404 Not Found**: Imagen no encontrada

### 3. PUT /api/images/[id]

Actualiza los metadatos de una imagen existente.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la imagen |

#### Body del Request

```json
{
  "altText": "Gatito amigurumi tejido a mano - Vista frontal",
  "isMain": true,
  "order": 1
}
```

#### Campos Actualizables

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `altText` | string | No | Texto alternativo |
| `isMain` | boolean | No | Si es imagen principal |
| `order` | integer | No | Orden de visualización |

#### Ejemplo de Request

```bash
curl -X PUT "https://api.solecitocrochet.com/api/images/img-001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "altText": "Gatito amigurumi tejido a mano - Vista frontal",
    "isMain": true,
    "order": 1
  }'
```

#### Ejemplo de Response

```json
{
  "image": {
    "id": "img-001",
    "url": "https://api.solecitocrochet.com/api/images/img-001",
    "altText": "Gatito amigurumi tejido a mano - Vista frontal",
    "isMain": true,
    "order": 1,
    "mimeType": "image/jpeg",
    "fileSize": 245760,
    "filename": "gatito.jpg",
    "entityType": "product",
    "entityId": "prod-001",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Imagen actualizada exitosamente"
}
```

### 4. DELETE /api/images/[id]

Elimina una imagen del sistema.

#### Headers Requeridos

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Parámetros de Path

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | Sí | ID único de la imagen |

#### Validaciones

- Solo se pueden eliminar imágenes de entidades activas
- Si es imagen principal, se debe asignar otra como principal
- Requiere rol ADMIN o SUPERADMIN

#### Ejemplo de Request

```bash
curl -X DELETE "https://api.solecitocrochet.com/api/images/img-001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Ejemplo de Response

```json
{
  "message": "Imagen eliminada exitosamente",
  "deletedImage": {
    "id": "img-001",
    "filename": "gatito.jpg",
    "entityType": "product",
    "entityId": "prod-001"
  }
}
```

## 🏗️ Sistema de Almacenamiento

### Almacenamiento BLOB

Las imágenes se almacenan directamente en la base de datos PostgreSQL:

```typescript
interface ProductImage {
  id: string;
  url?: string;         // URL externa (opcional)
  imageData?: Buffer;   // Datos binarios (BLOB)
  altText?: string;     // Texto alternativo
  isMain: boolean;      // Imagen principal
  order: number;        // Orden de visualización
  mimeType?: string;    // Tipo MIME
  fileSize?: number;    // Tamaño en bytes
  filename?: string;    // Nombre original del archivo
  entityType: string;   // 'product' o 'category'
  entityId: string;     // ID de la entidad
  createdAt: Date;
  updatedAt: Date;
}
```

### URLs Externas

También se pueden usar URLs externas para imágenes:

```json
{
  "url": "https://cdn.example.com/images/gatito.jpg",
  "entityType": "product",
  "entityId": "prod-001"
}
```

## 🖼️ Tipos de Imagen

### Imágenes de Productos

- **Vista principal**: Imagen destacada para listados
- **Galería**: Múltiples vistas del producto
- **Detalles**: Imágenes de cerca para texturas
- **Uso**: Imágenes del producto en contexto

### Imágenes de Categorías

- **Banner**: Imagen de cabecera para la categoría
- **Icono**: Representación visual pequeña
- **Fondo**: Imagen de fondo para landing pages

## 🔍 Filtros y Búsqueda

### Obtener Imágenes por Entidad

```bash
# Imágenes de un producto específico
GET /api/products/prod-001/images

# Imágenes de una categoría
GET /api/categories/amigurumis/images
```

### Filtros Disponibles

```bash
# Solo imágenes principales
GET /api/images?isMain=true

# Por tipo de entidad
GET /api/images?entityType=product

# Por tamaño mínimo
GET /api/images?minSize=100000

# Por tipo MIME
GET /api/images?mimeType=image/jpeg
```

## 📊 Optimización de Imágenes

### Compresión Automática

- **JPG**: Compresión automática al 85% de calidad
- **PNG**: Optimización de paleta de colores
- **WebP**: Conversión automática para navegadores compatibles

### Redimensionamiento

- **Thumbnail**: 150x150px para listados
- **Medium**: 400x400px para vistas detalladas
- **Large**: 800x800px para zoom
- **Original**: Tamaño completo sin modificar

### Lazy Loading

```html
<img 
  src="https://api.solecitocrochet.com/api/images/img-001?size=thumbnail"
  data-src="https://api.solecitocrochet.com/api/images/img-001?size=large"
  loading="lazy"
  alt="Gatito amigurumi"
/>
```

## 🚨 Manejo de Errores

### Códigos de Error Comunes

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `IMAGE_NOT_FOUND` | 404 | Imagen no encontrada |
| `INVALID_FILE_TYPE` | 400 | Tipo de archivo no soportado |
| `FILE_TOO_LARGE` | 413 | Archivo excede el tamaño máximo |
| `UNAUTHORIZED` | 401 | Token faltante o inválido |
| `FORBIDDEN` | 403 | Permisos insuficientes |
| `ENTITY_NOT_FOUND` | 404 | Entidad asociada no encontrada |

### Ejemplo de Error Response

```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "El archivo excede el tamaño máximo permitido",
    "details": {
      "fileSize": 15728640,
      "maxSize": 10485760,
      "allowedTypes": ["image/jpeg", "image/png", "image/webp"]
    }
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## 🔄 Operaciones en Lote

### Subir Múltiples Imágenes

```bash
POST /api/images/batch
```

```json
{
  "images": [
    {
      "file": "file1.jpg",
      "altText": "Vista frontal",
      "order": 1
    },
    {
      "file": "file2.jpg",
      "altText": "Vista lateral",
      "order": 2
    }
  ],
  "entityType": "product",
  "entityId": "prod-001"
}
```

### Actualizar Orden de Imágenes

```bash
PUT /api/images/reorder
```

```json
{
  "reorder": [
    { "id": "img-001", "order": 1 },
    { "id": "img-002", "order": 2 },
    { "id": "img-003", "order": 3 }
  ]
}
```

## 📈 Mejores Prácticas

### Para Desarrolladores

1. **Usar lazy loading** para mejorar rendimiento
2. **Implementar fallbacks** para imágenes no encontradas
3. **Optimizar tamaños** según el contexto de uso
4. **Manejar errores** de carga de imágenes

### Para Administradores

1. **Usar formatos WebP** cuando sea posible
2. **Mantener altText** descriptivo para accesibilidad
3. **Organizar orden** lógico de imágenes
4. **Monitorear uso** de almacenamiento

### Para SEO y Accesibilidad

1. **Alt text descriptivo** para cada imagen
2. **Nombres de archivo** significativos
3. **Compresión optimizada** para velocidad
4. **Responsive images** para diferentes dispositivos

## 🔗 Endpoints Relacionados

- **[📦 Productos](./products.md)** - Gestión de productos con imágenes
- **[📂 Categorías](./categories.md)** - Imágenes de categorías
- **[📊 Estadísticas Admin](./../admin.md)** - Métricas de uso de imágenes
- **[🏗️ Arquitectura](./../architecture/README.md)** - Diseño del sistema de imágenes

## 💾 Límites y Restricciones

### Tamaños de Archivo

| Tipo | Máximo | Recomendado |
|------|--------|-------------|
| JPG/JPEG | 10MB | 2-5MB |
| PNG | 10MB | 1-3MB |
| WebP | 10MB | 1-3MB |
| GIF | 5MB | 1-2MB |

### Límites por Usuario

- **Máximo de imágenes**: 100 por producto
- **Máximo de imágenes principales**: 1 por producto
- **Tamaño total**: 100MB por usuario

---

*🖼️ Sistema de gestión de imágenes optimizado para rendimiento y accesibilidad*
