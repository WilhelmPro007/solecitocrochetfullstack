# ?? Solecito Crochet - API & E-commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

> Una API REST completa y plataforma de e-commerce especializada en productos de crochet, construida con tecnolog�as modernas para escalabilidad y facilidad de integraci�n.

## ?? Tabla de Contenidos

- [?? Caracter�sticas](#-caracter�sticas)
- [?? Instalaci�n](#-instalaci�n)
- [?? Inicio R�pido](#-inicio-r�pido)
- [?? Documentaci�n](#-documentaci�n)
- [?? Autenticaci�n](#-autenticaci�n)
- [??? Tecnolog�as](#?-tecnolog�as)
- [?? Soporte](#-soporte)

---

## ?? Caracter�sticas

### ? API Profesional
- **REST API completa** con 40+ endpoints documentados
- **Autenticaci�n JWT** con roles (Cliente, Admin, SuperAdmin)
- **Rate limiting** inteligente (1000 req/min autenticado)
- **Sistema de cach�** con headers HTTP apropiados
- **Documentaci�n t�cnica** completa para desarrolladores

### ? Gesti�n de Productos Avanzada
- **CRUD completo** de productos con im�genes BLOB
- **Sistema de categor�as** h�brido (predefinidas + personalizadas)
- **Sistema de popularidad** autom�tico con algoritmos inteligentes
- **B�squeda y filtros** avanzados con paginaci�n
- **Tracking de interacciones** (views, WhatsApp, favoritos)

### ? Caracter�sticas T�cnicas
- **Next.js 15** con App Router y Server Components
- **Prisma ORM** con PostgreSQL para datos robustos
- **Sistema de jobs** as�ncronos con colas en memoria
- **Almacenamiento de im�genes** BLOB optimizado
- **TypeScript** para tipado fuerte y mejor DX

---

## ?? Instalaci�n

### Prerrequisitos
- **Node.js** >= 18.0.0
- **PostgreSQL** >= 15
- **npm**, **yarn** o **pnpm**

### Instalaci�n R�pida

```bash
# Clonar el repositorio
git clone https://github.com/your-username/solecito-crochet.git
cd solecito-crochet

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Configurar base de datos
npx prisma generate
npx prisma db push

# Ejecutar en desarrollo
npm run dev
```

---

## ?? Inicio R�pido

### 1. Configurar Base de Datos
```bash
# Crear base de datos
createdb solecito_crochet

# Ejecutar migraciones
npx prisma db push
```

### 2. Iniciar Servidor
```bash
# Desarrollo
npm run dev

# Producci�n
npm run build
npm start
```

### 3. Primer Request
```bash
# Obtener productos (no requiere auth)
curl http://localhost:3000/api/products

# Crear usuario admin (desde el frontend)
# Visita http://localhost:3000/register
```

---

## ?? Documentaci�n

### ?? Documentaci�n Principal
- **[?? API Reference](./docs/api/README.md)** - Documentaci�n completa de la API
- **[?? Gu�a del Desarrollador](./docs/api/DEVELOPER_GUIDE.md)** - Gu�a t�cnica para integraci�n
- **[?? Referencia T�cnica](./docs/api/API_REFERENCE.md)** - Especificaciones detalladas

### ?? Estructura de Documentaci�n

```
docs/
+-- api/
�   +-- README.md                 # Documentaci�n principal de API
�   +-- DEVELOPER_GUIDE.md        # Gu�a para desarrolladores
�   +-- API_REFERENCE.md          # Referencia t�cnica completa
�   +-- endpoints/
�   �   +-- products.md          # Endpoints de productos
�   �   +-- authentication.md    # Autenticaci�n
�   �   +-- categories.md        # Categor�as
�   �   +-- images.md           # Im�genes
�   +-- architecture/
�   �   +-- README.md           # Arquitectura del sistema
�   +-- examples/
�       +-- SDK_EXAMPLES.md     # Ejemplos de integraci�n
+-- API_ENDPOINTS.md             # Referencia r�pida de endpoints
+-- productsApiDocumentations.md # Documentaci�n espec�fica de productos
```

---

## ?? Autenticaci�n

### Sistema de Roles
- **?? CLIENTE**: Acceso de lectura, tracking de productos
- **????? ADMIN**: Gesti�n completa de productos y categor�as
- **?? SUPERADMIN**: Control total del sistema

### Endpoints de Autenticaci�n

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "secure_password"
}

# Registro
POST /api/register
Content-Type: application/json

{
  "name": "Juan P�rez",
  "email": "juan@example.com",
  "password": "secure_password"
}
```

---

## ??? Tecnolog�as

### Core Framework
| Tecnolog�a | Versi�n | Prop�sito |
|------------|---------|-----------|
| **Next.js** | 15.3.3 | Framework React full-stack |
| **React** | 19.0.0 | Librer�a de UI |
| **TypeScript** | 5.x | Tipado est�tico |

### Base de Datos & ORM
| Tecnolog�a | Versi�n | Prop�sito |
|------------|---------|-----------|
| **PostgreSQL** | 15+ | Base de datos relacional |
| **Prisma** | 6.10.0 | ORM moderno |

### Autenticaci�n & Seguridad
| Tecnolog�a | Versi�n | Prop�sito |
|------------|---------|-----------|
| **NextAuth.js** | 4.24.11 | Autenticaci�n completa |
| **bcryptjs** | 3.0.2 | Hash de contrase�as |

---

## ?? Soporte

### Canales de Soporte
- **?? Email**: soporte@solecitocrochet.com
- **?? Discord**: #api-support
- **?? Documentaci�n**: https://docs.solecitocrochet.com
- **?? Issues**: https://github.com/your-username/solecito-crochet/issues

### Recursos para Desarrolladores
- **[?? Documentaci�n de API](./docs/api/README.md)**
- **[?? Gu�a del Desarrollador](./docs/api/DEVELOPER_GUIDE.md)**
- **[?? Referencia de Endpoints](./API_ENDPOINTS.md)**

---

## ?? Licencia

Este proyecto est� bajo la **Licencia MIT**. Ver el archivo [LICENSE](./LICENSE) para m�s detalles.

---

*?? Construido con ?? para la comunidad de crochet en Nicaragua*
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma db push

# Ejecutar en desarrollo
npm run dev
`

## Inicio R�pido

### 1. Configurar Base de Datos
`ash
createdb solecito_crochet
npx prisma db push
`

### 2. Iniciar Servidor
`ash
npm run dev
`

### 3. Primer Request
`ash
# Obtener productos
curl http://localhost:3000/api/products
`

## Documentaci�n

- **[API Reference](./docs/api/README.md)** - Documentaci�n completa
- **[Gu�a del Desarrollador](./docs/api/DEVELOPER_GUIDE.md)** - Gu�a t�cnica
- **[Referencia T�cnica](./docs/api/API_REFERENCE.md)** - Especificaciones
- **[Endpoints](./API_ENDPOINTS.md)** - Referencia r�pida

## Tecnolog�as

- **Next.js 15** - Framework React full-stack
- **Prisma ORM** - Base de datos PostgreSQL
- **TypeScript** - Tipado fuerte
- **NextAuth.js** - Autenticaci�n JWT

## Licencia

MIT License - ver [LICENSE](./LICENSE) para m�s detalles.

---

