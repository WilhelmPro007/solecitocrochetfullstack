# 🧶 Solecito Crochet - API & E-commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

> API REST completa para gestión de productos de crochet construida con Next.js 15 y Prisma ORM.

## 🚀 Características

### ✅ API Profesional
- **REST API completa** con 40+ endpoints documentados
- **Autenticación JWT** con roles (Cliente, Admin, SuperAdmin)
- **Rate limiting** inteligente (1000 req/min autenticado)
- **Sistema de caché** con headers HTTP apropiados
- **Documentación técnica** completa para desarrolladores

### ✅ Gestión de Productos Avanzada
- **CRUD completo** de productos con imágenes BLOB
- **Sistema de categorías** híbrido (predefinidas + personalizadas)
- **Sistema de popularidad** automático con algoritmos inteligentes
- **Búsqueda y filtros** avanzados con paginación
- **Tracking de interacciones** (views, WhatsApp, favoritos)

### ✅ Características Técnicas
- **Next.js 15** con App Router y Server Components
- **Prisma ORM** con PostgreSQL para datos robustos
- **Sistema de jobs** asíncronos con colas en memoria
- **Almacenamiento de imágenes** BLOB optimizado
- **TypeScript** para tipado fuerte y mejor DX

## 📦 Instalación

### Prerrequisitos
- **Node.js** >= 18.0.0
- **PostgreSQL** >= 15

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/your-username/solecito-crochet.git
cd solecito-crochet

# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma db push

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Inicio Rápido

### 1. Configurar Base de Datos
```bash
createdb solecito_crochet
npx prisma db push
```

### 2. Iniciar Servidor
```bash
npm run dev
```

### 3. Primer Request
```bash
# Obtener productos
curl http://localhost:3000/api/products
```

## 📚 Documentación

### 📖 Documentación Principal
- **[📋 API Reference](./docs/api/README.md)** - Documentación completa de la API
- **[🚀 Guía del Desarrollador](./docs/api/DEVELOPER_GUIDE.md)** - Guía técnica para integración
- **[🔧 Referencia Técnica](./docs/api/API_REFERENCE.md)** - Especificaciones detalladas

### 📁 Estructura de Documentación

```
docs/
├── api/
│   ├── README.md                 # Documentación principal de API
│   ├── DEVELOPER_GUIDE.md        # Guía para desarrolladores
│   ├── API_REFERENCE.md          # Referencia técnica completa
│   ├── endpoints/
│   │   ├── products.md          # Endpoints de productos
│   │   ├── authentication.md    # Autenticación
│   │   ├── categories.md        # Categorías
│   │   ├── images.md           # Imágenes
│   │   └── admin.md            # Administración
│   ├── architecture/
│   │   └── README.md           # Arquitectura del sistema
│   ├── deployment/
│   │   └── README.md           # Guía de despliegue
│   └── examples/
│       └── SDK_EXAMPLES.md     # Ejemplos de integración
├── API_ENDPOINTS.md             # Referencia rápida de endpoints
└── productsApiDocumentations.md # Documentación específica de productos
```

### 🎯 Documentos Adicionales
- **[📋 Endpoints de Productos](./API_ENDPOINTS.md)** - Referencia rápida
- **[📊 Documentación de Productos](./productsApiDocumentations.md)** - Detalles específicos
- **[⚙️ Reglas del Proyecto](./PROJECT_RULES.md)** - Estándares y convenciones

## 🔐 Autenticación

### Sistema de Roles
- **👤 CLIENTE**: Acceso de lectura, tracking de productos
- **👨‍💼 ADMIN**: Gestión completa de productos y categorías
- **👑 SUPERADMIN**: Control total del sistema

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "secure_password"
}
```

### Uso en Código
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { access_token } = await response.json();
```

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.3.3 | Framework React full-stack |
| **React** | 19.0.0 | Librería de UI |
| **TypeScript** | 5.x | Tipado estático |
| **PostgreSQL** | 15+ | Base de datos relacional |
| **Prisma** | 6.10.0 | ORM moderno |
| **NextAuth.js** | 4.24.11 | Autenticación completa |

## 📞 Soporte

### Canales de Soporte
- **📧 Email**: soporte@solecitocrochet.com
- **💬 Discord**: #api-support
- **📚 Documentación**: https://docs.solecitocrochet.com
- **🐛 Issues**: https://github.com/your-username/solecito-crochet/issues

### Recursos para Desarrolladores
- **[📖 Documentación de API](./docs/api/README.md)**
- **[🚀 Guía del Desarrollador](./docs/api/DEVELOPER_GUIDE.md)**
- **[🔧 Referencia de Endpoints](./API_ENDPOINTS.md)**

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

*🚀 Construido con ❤️ para la comunidad de crochet en Nicaragua*
