# 🚀 Guía de Despliegue - Solecito Crochet API

## 📋 Descripción General

Esta guía proporciona instrucciones completas para desplegar la API de Solecito Crochet en diferentes entornos, desde desarrollo local hasta producción en la nube.

---

## 🛠️ Requisitos Previos

### Software Requerido

#### Desarrollo Local
- **Node.js** 18.x o superior
- **npm** 9.x o **yarn** 1.22.x
- **PostgreSQL** 15.x o superior
- **Git** para control de versiones

#### Producción
- **Servidor Linux** (Ubuntu 20.04+ recomendado)
- **Docker** 20.x+ (opcional pero recomendado)
- **Nginx** para reverse proxy
- **PM2** para gestión de procesos Node.js

### Recursos del Sistema

#### Mínimos
- **CPU**: 1 vCPU
- **RAM**: 2 GB
- **Storage**: 20 GB SSD
- **Network**: 1 Gbps

#### Recomendados
- **CPU**: 2+ vCPU
- **RAM**: 4+ GB
- **Storage**: 50+ GB SSD
- **Network**: 2+ Gbps

---

## 🏗️ Configuración del Entorno

### Variables de Entorno

#### Desarrollo (.env.local)
```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/solecitocrochet"

# Autenticación
NEXTAUTH_SECRET="tu_secret_super_seguro_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Configuración de la aplicación
NODE_ENV="development"
PORT="3000"
```

#### Producción (.env.production)
```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@servidor:5432/solecitocrochet"
DATABASE_POOL_SIZE="20"
DATABASE_SSL="true"

# Autenticación
NEXTAUTH_SECRET="secret_super_seguro_produccion"
NEXTAUTH_URL="https://api.solecitocrochet.com"

# Configuración de la aplicación
NODE_ENV="production"
PORT="3000"

# Performance
NEXT_TELEMETRY_DISABLED="1"
```

### Configuración de Base de Datos

#### PostgreSQL
```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear usuario y base de datos
sudo -u postgres psql

CREATE USER solecitocrochet WITH PASSWORD 'tu_contraseña_segura';
CREATE DATABASE solecitocrochet OWNER solecitocrochet;
GRANT ALL PRIVILEGES ON DATABASE solecitocrochet TO solecitocrochet;

# Configurar conexiones SSL
sudo nano /etc/postgresql/15/main/postgresql.conf

# Agregar/modificar:
ssl = on
ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

---

## 🚀 Despliegue Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/solecitocrochet.git
cd solecitocrochet
```

### 2. Instalar Dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar Base de Datos
```bash
# Generar cliente de Prisma
npx prisma generate

# Crear base de datos
npx prisma db push

# (Opcional) Ejecutar migraciones
npx prisma migrate dev
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
# o
yarn dev
```

### 5. Verificar Instalación
- **API**: http://localhost:3000/api/products
- **Dashboard**: http://localhost:3000/dashboard
- **Prisma Studio**: `npx prisma studio`

---

## 🌐 Despliegue en Producción

### Opción 1: Despliegue Manual

#### 1. Preparar el Servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib
```

#### 2. Configurar la Aplicación
```bash
# Crear usuario para la aplicación
sudo useradd -m -s /bin/bash solecitocrochet
sudo usermod -aG sudo solecitocrochet

# Cambiar al usuario
sudo su - solecitochet

# Clonar repositorio
git clone https://github.com/tu-usuario/solecitocrochet.git
cd solecitocrochet

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.production
nano .env.production

# Generar cliente de Prisma
npx prisma generate

# Crear base de datos
npx prisma db push
```

#### 3. Configurar PM2
```bash
# Crear archivo de configuración PM2
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'solecitocrochet-api',
    script: 'npm',
    args: 'start',
    cwd: '/home/solecitocrochet/solecitocrochet',
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
  }]
};
```

```bash
# Iniciar aplicación
pm2 start ecosystem.config.js --env production

# Configurar inicio automático
pm2 startup
pm2 save
```

#### 4. Configurar Nginx
```bash
# Crear configuración del sitio
sudo nano /etc/nginx/sites-available/solecitocrochet
```

```nginx
server {
    listen 80;
    server_name api.solecitocrochet.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.solecitocrochet.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/api.solecitocrochet.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.solecitocrochet.com/privkey.pem;

    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Headers de seguridad
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Logs
    access_log /var/log/nginx/solecitocrochet_access.log;
    error_log /var/log/nginx/solecitocrochet_error.log;

    # Proxy a la aplicación
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Cache para imágenes
    location /api/images/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/solecitocrochet /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### 5. Configurar SSL con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.solecitocrochet.com

# Configurar renovación automática
sudo crontab -e

# Agregar línea:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Opción 2: Despliegue con Docker

#### 1. Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build de la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://solecitocrochet:password@db:5432/solecitocrochet
      - NEXTAUTH_SECRET=tu_secret_aqui
      - NEXTAUTH_URL=https://api.solecitocrochet.com
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=solecitocrochet
      - POSTGRES_USER=solecitocrochet
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 3. Despliegue con Docker
```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

---

## 🔧 Configuración de Producción

### Optimizaciones de Next.js

#### next.config.ts
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  images: {
    domains: ['api.solecitocrochet.com'],
    formats: ['image/webp', 'image/avif']
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: true,
  swcMinify: true
};

module.exports = nextConfig;
```

### Configuración de Prisma

#### schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["referentialIntegrity"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ... resto del esquema
```

### Variables de Entorno de Producción
```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@servidor:5432/solecitocrochet?schema=public&connection_limit=20&pool_timeout=20"
DIRECT_URL="postgresql://usuario:contraseña@servidor:5432/solecitocrochet?schema=public"

# Performance
NODE_OPTIONS="--max-old-space-size=4096"
UV_THREADPOOL_SIZE=64
```

---

## 📊 Monitoreo y Logs

### Configuración de PM2
```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs solecitocrochet-api

# Monitoreo de recursos
pm2 monit

# Reiniciar aplicación
pm2 restart solecitocrochet-api

# Recargar aplicación (zero-downtime)
pm2 reload solecitocrochet-api
```

### Logs de Nginx
```bash
# Ver logs de acceso
sudo tail -f /var/log/nginx/solecitocrochet_access.log

# Ver logs de error
sudo tail -f /var/log/nginx/solecitocrochet_error.log

# Analizar logs con herramientas
sudo apt install goaccess
goaccess /var/log/nginx/solecitocrochet_access.log -o /var/www/html/report.html --log-format=COMBINED
```

### Monitoreo de Base de Datos
```bash
# Conectar a PostgreSQL
sudo -u postgres psql

# Ver conexiones activas
SELECT * FROM pg_stat_activity;

# Ver estadísticas de tablas
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables;

# Ver tamaño de tablas
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔒 Seguridad en Producción

### Firewall
```bash
# Configurar UFW
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Verificar estado
sudo ufw status
```

### Actualizaciones de Seguridad
```bash
# Configurar actualizaciones automáticas
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Verificar configuración
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### Backup de Base de Datos
```bash
# Script de backup automático
sudo nano /usr/local/bin/backup-database.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="solecitocrochet"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Crear backup
sudo -u postgres pg_dump $DB_NAME > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Comprimir backup
gzip $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Eliminar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Log del backup
echo "Backup completado: ${DB_NAME}_${DATE}.sql.gz" >> /var/log/backup.log
```

```bash
# Hacer ejecutable
sudo chmod +x /usr/local/bin/backup-database.sh

# Configurar cron para backup diario
sudo crontab -e

# Agregar línea:
0 2 * * * /usr/local/bin/backup-database.sh
```

---

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de Base de Datos
```bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Reiniciar servicio
sudo systemctl restart postgresql
```

#### Error de Memoria
```bash
# Verificar uso de memoria
free -h

# Verificar procesos Node.js
ps aux | grep node

# Reiniciar aplicación
pm2 restart solecitocrochet-api
```

#### Error de SSL
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew

# Verificar configuración Nginx
sudo nginx -t
```

### Logs de Debug
```bash
# Ver logs de la aplicación
pm2 logs solecitocrochet-api --lines 100

# Ver logs de Nginx
sudo tail -f /var/log/nginx/solecitocrochet_error.log

# Ver logs del sistema
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
```

---

## 📈 Escalabilidad

### Load Balancing
```nginx
# Configuración de upstream para múltiples instancias
upstream solecitocrochet_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    # ... configuración SSL ...
    
    location / {
        proxy_pass http://solecitocrochet_backend;
        # ... resto de configuración proxy ...
    }
}
```

### Múltiples Instancias PM2
```bash
# Escalar a múltiples instancias
pm2 scale solecitocrochet-api 4

# Verificar distribución de carga
pm2 monit
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- [README Principal](../README.md) - Visión general del proyecto
- [Guía del Desarrollador](../DEVELOPER_GUIDE.md) - Guía técnica completa
- [Arquitectura](../architecture/README.md) - Documentación de arquitectura

### Herramientas de Despliegue
- **PM2**: Gestión de procesos Node.js
- **Nginx**: Reverse proxy y servidor web
- **Docker**: Contenedores para despliegue
- **Let's Encrypt**: Certificados SSL gratuitos

---

## 🎯 Conclusión

Esta guía de despliegue proporciona todas las instrucciones necesarias para desplegar la API de Solecito Crochet en diferentes entornos. El sistema está diseñado para ser robusto, escalable y fácil de mantener en producción.

### Puntos Clave del Despliegue
- **Configuración Automatizada**: Scripts y herramientas para automatizar el proceso
- **Seguridad Robusta**: SSL, firewall y actualizaciones automáticas
- **Monitoreo Completo**: Logs, métricas y alertas
- **Escalabilidad**: Preparado para múltiples instancias y load balancing
- **Backup Automático**: Sistema de respaldo de base de datos

---

*Guía de Despliegue - Solecito Crochet API v1.0.0*

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Estado**: ✅ **PRODUCCIÓN READY**
