# 🚀 Guía de Despliegue - Solecito Crochet

## 📋 Descripción General

Esta guía proporciona instrucciones detalladas para desplegar la API de Solecito Crochet en diferentes entornos, desde desarrollo local hasta producción en la nube.

## 🛠️ Prerrequisitos

### Requisitos del Sistema

- **Node.js**: >= 18.0.0
- **PostgreSQL**: >= 15.0
- **RAM**: Mínimo 2GB (recomendado 4GB+)
- **Disco**: Mínimo 10GB de espacio libre
- **CPU**: 2 cores mínimo (recomendado 4+)

### Herramientas Requeridas

- **Git**: Para clonar el repositorio
- **npm/yarn/pnpm**: Gestor de paquetes
- **Docker** (opcional): Para contenedores
- **PM2** (opcional): Para gestión de procesos en producción

## 📦 Instalación Local

### 1. Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/your-username/solecito-crochet.git
cd solecito-crochet

# Verificar la versión de Node.js
node --version  # Debe ser >= 18.0.0
npm --version   # Debe ser >= 8.0.0
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias
npm install

# Verificar instalación
npm run build
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Instalar PostgreSQL (macOS)
brew install postgresql

# Instalar PostgreSQL (Windows)
# Descargar desde https://www.postgresql.org/download/windows/

# Crear base de datos
sudo -u postgres createdb solecito_crochet
sudo -u postgres createuser solecito_user
sudo -u postgres psql -c "ALTER USER solecito_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE solecito_crochet TO solecito_user;"
```

#### Opción B: Docker PostgreSQL

```bash
# Ejecutar PostgreSQL en Docker
docker run --name solecito-postgres \
  -e POSTGRES_DB=solecito_crochet \
  -e POSTGRES_USER=solecito_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15

# Verificar que esté ejecutándose
docker ps
```

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar variables de entorno
nano .env.local
```

#### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://solecito_user:your_password@localhost:5432/solecito_crochet"

# Autenticación
NEXTAUTH_SECRET="your-super-secret-key-here-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# API
CRON_SECRET_TOKEN="your-cron-secret-token-here"

# Entorno
NODE_ENV="development"
```

### 5. Configurar Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# (Opcional) Cargar datos de prueba
npx prisma db seed

# Verificar conexión
npx prisma studio
```

### 6. Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar funcionamiento
curl http://localhost:3000/api/products
```

## 🐳 Despliegue con Docker

### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Construir aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma client
RUN npx prisma generate

# Construir aplicación
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copiar Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://solecito_user:your_password@db:5432/solecito_crochet
      - NEXTAUTH_SECRET=your-production-secret-key
      - NEXTAUTH_URL=http://localhost:3000
      - CRON_SECRET_TOKEN=your-cron-secret
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=solecito_crochet
      - POSTGRES_USER=solecito_user
      - POSTGRES_PASSWORD=your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Comandos de Docker

```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en background
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## ☁️ Despliegue en la Nube

### Vercel (Recomendado)

#### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

#### 2. Configurar Proyecto

```bash
# Login en Vercel
vercel login

# Inicializar proyecto
vercel

# Seguir las instrucciones interactivas
```

#### 3. Configurar Variables de Entorno

```bash
# Agregar variables de entorno
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add CRON_SECRET_TOKEN

# Ver variables configuradas
vercel env ls
```

#### 4. Desplegar

```bash
# Desplegar a producción
vercel --prod

# Desplegar preview
vercel
```

### Railway

#### 1. Instalar Railway CLI

```bash
npm i -g @railway/cli
```

#### 2. Configurar Proyecto

```bash
# Login en Railway
railway login

# Inicializar proyecto
railway init

# Agregar servicio de base de datos
railway add
```

#### 3. Configurar Variables

```bash
# Agregar variables de entorno
railway variables set DATABASE_URL="your-database-url"
railway variables set NEXTAUTH_SECRET="your-secret"
railway variables set CRON_SECRET_TOKEN="your-token"
```

#### 4. Desplegar

```bash
# Desplegar
railway up

# Ver logs
railway logs
```

### Heroku

#### 1. Instalar Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Descargar desde https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Configurar Proyecto

```bash
# Login en Heroku
heroku login

# Crear aplicación
heroku create your-app-name

# Agregar addon de PostgreSQL
heroku addons:create heroku-postgresql:mini
```

#### 3. Configurar Variables

```bash
# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set NEXTAUTH_SECRET="your-secret-key"
heroku config:set CRON_SECRET_TOKEN="your-cron-token"
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"
```

#### 4. Desplegar

```bash
# Desplegar
git push heroku main

# Ejecutar migraciones
heroku run npx prisma db push

# Ver logs
heroku logs --tail
```

## 🔧 Configuración de Producción

### 1. Variables de Entorno de Producción

```env
# Entorno
NODE_ENV=production

# Base de datos
DATABASE_URL="postgresql://user:password@prod-db:5432/solecito_prod"

# Autenticación
NEXTAUTH_SECRET="your-production-secret-key-minimum-32-characters"
NEXTAUTH_URL="https://your-domain.com"

# API
CRON_SECRET_TOKEN="your-production-cron-secret"

# Opcionales
REDIS_URL="redis://your-redis-instance"
S3_BUCKET="your-s3-bucket"
CDN_URL="https://cdn.your-domain.com"
```

### 2. Configuración de Next.js

```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  images: {
    domains: ['your-domain.com', 'cdn.your-domain.com'],
    formats: ['image/webp', 'image/avif']
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400'
        }
      ]
    }
  ]
}

export default nextConfig
```

### 3. Configuración de Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ... resto del schema
```

### 4. Configuración de PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'solecito-api',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}
```

## 📊 Monitoreo y Logging

### 1. Configuración de Logs

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'solecito-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
```

### 2. Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    }, { status: 503 })
  }
}
```

### 3. Métricas de Rendimiento

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()
  
  const response = NextResponse.next()
  
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`)
  response.headers.set('X-Server', 'solecito-api')
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}
```

## 🔒 Seguridad

### 1. Rate Limiting

```typescript
// lib/rateLimit.ts
import { NextRequest, NextResponse } from 'next/server'

const rateLimit = new Map()

export function rateLimiter(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minuto
  const maxRequests = 100

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
  } else {
    const userData = rateLimit.get(ip)
    if (now > userData.resetTime) {
      userData.count = 1
      userData.resetTime = now + windowMs
    } else {
      userData.count++
    }
    
    if (userData.count > maxRequests) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }
  }

  return null
}
```

### 2. CORS Configuration

```typescript
// lib/cors.ts
import { NextRequest, NextResponse } from 'next/server'

export function corsMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

### 3. Helmet Headers

```typescript
// lib/security.ts
import { NextResponse } from 'next/server'

export function securityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}
```

## 🚀 Scripts de Despliegue

### 1. Script de Build

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "deploy:prod": "npm run build && npm run start",
    "deploy:docker": "docker-compose up --build -d",
    "deploy:vercel": "vercel --prod",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "health:check": "curl -f http://localhost:3000/api/health"
  }
}
```

### 2. Script de Verificación

```bash
#!/bin/bash
# scripts/deploy-check.sh

echo "🔍 Verificando despliegue..."

# Verificar que la aplicación esté ejecutándose
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ API respondiendo correctamente"
else
    echo "❌ API no responde"
    exit 1
fi

# Verificar base de datos
if npx prisma db execute --stdin < <(echo "SELECT 1") > /dev/null 2>&1; then
    echo "✅ Base de datos conectada"
else
    echo "❌ Error de conexión a base de datos"
    exit 1
fi

# Verificar variables de entorno
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ NEXTAUTH_SECRET no configurado"
    exit 1
fi

echo "🎉 Despliegue verificado exitosamente!"
```

## 📈 Escalabilidad

### 1. Load Balancing

```nginx
# nginx.conf
upstream solecito_api {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name api.solecitocrochet.com;

    location / {
        proxy_pass http://solecito_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. Redis para Caché

```typescript
// lib/redis.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function cacheGet(key: string) {
  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Redis error:', error)
    return null
  }
}

export async function cacheSet(key: string, value: any, ttl = 3600) {
  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Redis error:', error)
  }
}
```

### 3. CDN para Imágenes

```typescript
// lib/cdn.ts
export function getCDNUrl(path: string, size?: string) {
  const cdnUrl = process.env.CDN_URL || 'https://cdn.solecitocrochet.com'
  
  if (size) {
    return `${cdnUrl}/images/${size}/${path}`
  }
  
  return `${cdnUrl}/images/${path}`
}
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos

```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U solecito_user -d solecito_crochet

# Verificar variables de entorno
echo $DATABASE_URL
```

#### 2. Error de Build

```bash
# Limpiar caché
rm -rf .next node_modules
npm install

# Verificar versión de Node.js
node --version

# Reconstruir
npm run build
```

#### 3. Error de Permisos

```bash
# Verificar permisos de archivos
ls -la

# Cambiar propietario
sudo chown -R $USER:$USER .

# Cambiar permisos
chmod +x scripts/*.sh
```

### Logs y Debugging

```bash
# Ver logs de la aplicación
npm run dev 2>&1 | tee app.log

# Ver logs de Docker
docker-compose logs -f app

# Ver logs de Vercel
vercel logs

# Ver logs de Heroku
heroku logs --tail
```

## 📚 Recursos Adicionales

### Documentación

- **[Next.js Deployment](https://nextjs.org/docs/deployment)**
- **[Prisma Deployment](https://www.prisma.io/docs/guides/deployment)**
- **[Vercel Documentation](https://vercel.com/docs)**
- **[Railway Documentation](https://docs.railway.app)**

### Herramientas

- **[PM2](https://pm2.keymetrics.io/)**: Gestión de procesos
- **[Winston](https://github.com/winstonjs/winston)**: Logging
- **[Redis](https://redis.io/)**: Caché y sesiones
- **[Nginx](https://nginx.org/)**: Load balancer y proxy reverso

---

*🚀 Guía completa para desplegar Solecito Crochet en cualquier entorno*
