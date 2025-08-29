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

## 📦 Instalación y Configuración

### 🎯 Prerrequisitos

#### **Sistema Operativo**
- **Windows 10/11** ✅ (Probado en Windows 10.0.19045)
- **macOS 10.15+** ✅
- **Ubuntu 20.04+** ✅
- **WSL2** ✅ (Recomendado para Windows)

#### **Software Requerido**
- **Node.js** >= 18.0.0 ([Descargar aquí](https://nodejs.org/))
- **PostgreSQL** >= 15 ([Descargar aquí](https://www.postgresql.org/download/))
- **Git** ([Descargar aquí](https://git-scm.com/))

#### **Verificar Instalaciones**
```bash
# Verificar Node.js
node --version
npm --version

# Verificar PostgreSQL
psql --version

# Verificar Git
git --version
```

---

## 🗄️ **CONFIGURACIÓN DE BASE DE DATOS - PASO A PASO**

### **PASO 1: Instalar PostgreSQL**

#### **Windows**
1. **Descargar PostgreSQL** desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. **Ejecutar instalador** como administrador
3. **Configurar contraseña** para usuario `postgres` (¡GUÁRDALA!)
4. **Puerto por defecto**: 5432
5. **Instalar pgAdmin** (opcional pero recomendado)

#### **macOS**
```bash
# Con Homebrew
brew install postgresql@15
brew services start postgresql@15

# O descargar desde postgresql.org
```

#### **Ubuntu/Debian**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **PASO 2: Crear Base de Datos**

#### **Opción A: Con pgAdmin (Recomendado para principiantes)**
1. **Abrir pgAdmin**
2. **Conectar al servidor** (localhost:5432)
3. **Click derecho en "Databases"** → "Create" → "Database"
4. **Nombre**: `solecito_crochet`
5. **Owner**: `postgres`
6. **Click "Save"**

#### **Opción B: Con línea de comandos**
```bash
# Conectar como usuario postgres
psql -U postgres -h localhost

# Crear base de datos
CREATE DATABASE solecito_crochet;

# Verificar que se creó
\l

# Salir
\q
```

#### **Opción C: Con createdb (más rápido)**
```bash
# Windows (desde Git Bash o WSL)
createdb -U postgres -h localhost solecito_crochet

# macOS/Linux
createdb solecito_crochet
```

### **PASO 3: Configurar Variables de Entorno**

#### **Crear archivo `.env.local`**
```bash
# En la raíz del proyecto
touch .env.local
```

#### **Contenido del archivo `.env.local`**
```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/solecito_crochet"

# NextAuth.js
NEXTAUTH_SECRET="tu_secret_super_seguro_aqui_minimo_32_caracteres"
NEXTAUTH_URL="http://localhost:3000"

# Variables opcionales
NODE_ENV="development"
```

#### **⚠️ IMPORTANTE: Configurar NEXTAUTH_SECRET**
```bash
# Generar secret seguro (mínimo 32 caracteres)
openssl rand -base64 32

# O usar este generador online: https://generate-secret.vercel.app/32
```

### **PASO 4: Instalar Dependencias del Proyecto**

```bash
# Clonar repositorio (si no lo has hecho)
git clone https://github.com/your-username/solecito-crochet.git
cd solecito-crochet

# Instalar dependencias
npm install

# Verificar instalación
npm list --depth=0
```

### **PASO 5: Configurar Prisma y Base de Datos**

```bash
# Generar cliente de Prisma
npx prisma generate

# Verificar conexión a la base de datos
npx prisma db pull

# Crear tablas en la base de datos
npx prisma db push

# (Opcional) Ver base de datos en Prisma Studio
npx prisma studio
```

### **PASO 6: Verificar Instalación**

```bash
# Verificar que todo funciona
npm run build

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🔧 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **❌ Error: "Connection refused"**
```bash
# Verificar que PostgreSQL esté corriendo
# Windows: Servicios → PostgreSQL
# macOS: brew services list
# Linux: sudo systemctl status postgresql

# Reiniciar PostgreSQL
# Windows: Servicios → PostgreSQL → Restart
# macOS: brew services restart postgresql
# Linux: sudo systemctl restart postgresql
```

### **❌ Error: "Authentication failed"**
```bash
# Verificar contraseña en .env.local
# Verificar usuario en DATABASE_URL
# Probar conexión manual:
psql -U postgres -h localhost -d solecito_crochet
```

### **❌ Error: "Database does not exist"**
```bash
# Crear base de datos manualmente
createdb -U postgres -h localhost solecito_crochet

# O con psql:
psql -U postgres -h localhost
CREATE DATABASE solecito_crochet;
```

### **❌ Error: "Prisma schema not found"**
```bash
# Verificar que estés en el directorio correcto
pwd
ls prisma/schema.prisma

# Regenerar cliente de Prisma
npx prisma generate
```

---

## 🚀 **INICIO RÁPIDO (Después de la configuración)**

### **1. Iniciar Servidor**
```bash
npm run dev
```

### **2. Verificar API**
```bash
# Probar endpoint de productos
curl http://localhost:3000/api/products

# Probar endpoint de categorías
curl http://localhost:3000/api/categories
```

### **3. Acceder a Prisma Studio**
```bash
npx prisma studio
# Abre http://localhost:5555 en tu navegador
```

---

## 📊 **ESTRUCTURA DE LA BASE DE DATOS**

### **Tablas Principales**
- **`User`** - Usuarios del sistema (CLIENTE, ADMIN, SUPERADMIN)
- **`Product`** - Productos de crochet
- **`Category`** - Categorías de productos
- **`ProductImage`** - Imágenes de productos (BLOB)
- **`ProductClick`** - Tracking de interacciones
- **`PopularityMetric`** - Métricas de popularidad

### **Relaciones Clave**
```
User (1) ←→ (N) Product
Product (1) ←→ (N) ProductImage
Product (N) ←→ (1) Category
Product (1) ←→ (1) PopularityMetric
```

---

## 🔐 **CONFIGURACIÓN DE AUTENTICACIÓN**

### **Crear Usuario Administrador Inicial**
```bash
# Conectar a la base de datos
psql -U postgres -h localhost -d solecito_crochet

# Insertar usuario admin (reemplaza con tus datos)
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@solecitocrochet.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS.Oe', -- password: admin123
  'SUPERADMIN',
  NOW(),
  NOW()
);

# Verificar inserción
SELECT id, name, email, role FROM "User";
```

### **Credenciales por Defecto**
- **Email**: `admin@solecitocrochet.com`
- **Contraseña**: `admin123`
- **Rol**: `SUPERADMIN`

---

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
