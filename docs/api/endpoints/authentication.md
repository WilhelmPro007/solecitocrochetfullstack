# 🔐 Sistema de Autenticación - Solecito Crochet

## 📋 Descripción General

El sistema de autenticación de Solecito Crochet utiliza NextAuth.js con JWT para proporcionar un sistema seguro y robusto de autenticación y autorización. El sistema incluye registro de usuarios, login, gestión de sesiones y control de acceso basado en roles.

---

## 🏗️ Arquitectura del Sistema

### Tecnologías Utilizadas
- **NextAuth.js**: Framework de autenticación para Next.js
- **JWT**: JSON Web Tokens para sesiones
- **Prisma**: ORM para gestión de base de datos
- **bcryptjs**: Hashing seguro de contraseñas
- **PostgreSQL**: Base de datos principal

### Flujo de Autenticación
```
Usuario → Login/Registro → NextAuth → JWT Token → Sesión → Acceso a Recursos
```

---

## 🔐 Endpoints de Autenticación

### 1. POST /api/auth/signin

Inicia sesión de un usuario existente.

#### 🔐 Autenticación
- **Requerida**: No (este es el endpoint de login)
- **Headers**: Content-Type: application/json

#### 📝 Request Body

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### 📤 Respuesta Exitosa (200)

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
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

#### ❌ Respuesta de Error (401)

```json
{
  "error": "Credenciales inválidas"
}
```

#### 💡 Ejemplo de Uso

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'contraseña123'
  })
});

const data = await response.json();
```

```bash
# cURL
curl -X POST "https://api.solecitocrochet.com/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }'
```

---

### 2. POST /api/register

Registra un nuevo usuario en el sistema.

#### 🔐 Autenticación
- **Requerida**: No (endpoint público)
- **Headers**: Content-Type: application/json

#### 📝 Request Body

```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "confirmPassword": "contraseña123",
  "role": "CLIENTE"
}
```

#### 📋 Validaciones

| Campo | Tipo | Requerido | Reglas |
|-------|------|-----------|---------|
| name | string | Sí | Mínimo 2 caracteres |
| email | string | Sí | Formato de email válido, único |
| password | string | Sí | Mínimo 6 caracteres |
| confirmPassword | string | Sí | Debe coincidir con password |
| role | string | Sí | Solo "CLIENTE" permitido |

#### 📤 Respuesta Exitosa (201)

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "email": "nuevo@ejemplo.com",
    "role": "CLIENTE"
  }
}
```

#### ❌ Respuestas de Error

**400 - Contraseñas no coinciden**
```json
{
  "error": "Las contraseñas no coinciden"
}
```

**400 - Usuario ya existe**
```json
{
  "error": "El usuario ya existe"
}
```

**400 - Rol inválido**
```json
{
  "error": "El rol solo puede ser cliente"
}
```

#### 💡 Ejemplo de Uso

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Nuevo Usuario',
    email: 'nuevo@ejemplo.com',
    password: 'contraseña123',
    confirmPassword: 'contraseña123',
    role: 'CLIENTE'
  })
});

const data = await response.json();
```

```bash
# cURL
curl -X POST "https://api.solecitocrochet.com/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Usuario",
    "email": "nuevo@ejemplo.com",
    "password": "contraseña123",
    "confirmPassword": "contraseña123",
    "role": "CLIENTE"
  }'
```

---

### 3. POST /api/auth/signout

Cierra la sesión del usuario actual.

#### 🔐 Autenticación
- **Requerida**: Sí (usuario debe estar autenticado)
- **Headers**: Authorization: Bearer {token}

#### 📤 Respuesta Exitosa (200)

```json
{
  "message": "Sesión cerrada exitosamente"
}
```

#### 💡 Ejemplo de Uso

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/auth/signout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

```bash
# cURL
curl -X POST "https://api.solecitocrochet.com/api/auth/signout" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. GET /api/auth/session

Obtiene información de la sesión actual del usuario.

#### 🔐 Autenticación
- **Requerida**: Sí (usuario debe estar autenticado)
- **Headers**: Authorization: Bearer {token}

#### 📤 Respuesta Exitosa (200)

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "role": "CLIENTE"
  },
  "expires": "2024-12-31T23:59:59.999Z"
}
```

#### ❌ Respuesta de Error (401)

```json
{
  "error": "No autorizado"
}
```

#### 💡 Ejemplo de Uso

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/auth/session', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

```bash
# cURL
curl -X GET "https://api.solecitocrochet.com/api/auth/session" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 👥 Sistema de Roles

### Roles Disponibles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **CLIENTE** | Usuario estándar | Ver productos, hacer pedidos, gestionar perfil |
| **ADMIN** | Administrador | CRUD de productos, gestión de categorías, métricas |
| **SUPERADMIN** | Super administrador | Todo lo de ADMIN + gestión de usuarios, configuración del sistema |

### Jerarquía de Permisos
```
SUPERADMIN > ADMIN > CLIENTE
```

---

## 🔒 Seguridad

### Hashing de Contraseñas
- **Algoritmo**: bcrypt
- **Salt Rounds**: 12 (configurable)
- **Almacenamiento**: Hash en base de datos, nunca texto plano

### JWT (JSON Web Tokens)
- **Estrategia**: JWT para sesiones
- **Expiración**: Configurable por sesión
- **Secret**: Variable de entorno NEXTAUTH_SECRET

### Protecciones Implementadas
- ✅ Validación de entrada
- ✅ Sanitización de datos
- ✅ Rate limiting (configurable)
- ✅ Protección CSRF
- ✅ Headers de seguridad

---

## 📱 Gestión de Sesiones

### Tipos de Sesión
- **JWT**: Tokens JSON Web para autenticación
- **Persistencia**: Base de datos PostgreSQL
- **Expiración**: Configurable por sesión

### Flujo de Sesión
1. Usuario se autentica
2. Se genera JWT token
3. Token se almacena en cliente
4. Token se valida en cada request
5. Sesión se mantiene hasta expiración

---

## 🚀 Implementación en Cliente

### Hook de Autenticación (React)

```typescript
import { useSession, signIn, signOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  return {
    session,
    status,
    login,
    logout,
    isAuthenticated: !!session,
    user: session?.user,
  };
}
```

### Middleware de Protección

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Lógica adicional de middleware
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificar permisos específicos
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN' || token?.role === 'SUPERADMIN';
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
```

---

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# .env.local
NEXTAUTH_SECRET=tu_secret_super_seguro_aqui
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/solecitocrochet
```

### Configuración de NextAuth

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // Configuración del provider
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Callbacks personalizados
  },
};
```

---

## 📊 Monitoreo y Logs

### Eventos de Auditoría
- ✅ Login exitoso/fallido
- ✅ Registro de usuarios
- ✅ Cambios de rol
- ✅ Accesos a recursos protegidos
- ✅ Cierre de sesiones

### Métricas de Seguridad
- Número de intentos de login fallidos
- Usuarios activos por sesión
- Distribución de roles
- Patrones de acceso sospechosos

---

## 🚨 Manejo de Errores

### Códigos de Error Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| 400 | Datos de entrada inválidos | Verificar formato de datos |
| 401 | No autorizado | Verificar token de autenticación |
| 403 | Acceso prohibido | Verificar permisos de rol |
| 409 | Conflicto (usuario duplicado) | Usar email diferente |
| 500 | Error interno del servidor | Contactar soporte |

### Respuestas de Error Estándar

```json
{
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:00:00Z",
  "path": "/api/auth/signin"
}
```

---

## 🔄 Flujos de Autenticación

### Flujo de Registro
```
1. Usuario envía datos de registro
2. Validación de datos de entrada
3. Verificación de usuario existente
4. Hashing de contraseña
5. Creación de usuario en BD
6. Respuesta de éxito
```

### Flujo de Login
```
1. Usuario envía credenciales
2. Validación de credenciales
3. Verificación de contraseña
4. Generación de JWT token
5. Creación de sesión
6. Respuesta con token
```

### Flujo de Autorización
```
1. Cliente envía request con token
2. Validación de JWT token
3. Verificación de permisos de rol
4. Acceso al recurso solicitado
5. Respuesta con datos
```

---

## 📚 Ejemplos de Uso

### Autenticación Completa

```typescript
// Ejemplo completo de autenticación
class AuthService {
  private baseUrl = 'https://api.solecitocrochet.com';

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  }

  async getSession(token: string): Promise<SessionResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('No autorizado');
    }

    return response.json();
  }
}
```

---

## 🎯 Casos de Uso

### 1. E-commerce de Crochet
- **Clientes**: Registro y acceso a catálogo
- **Administradores**: Gestión de productos y métricas
- **Super Administradores**: Configuración del sistema

### 2. Plataforma de Artesanías
- **Artistas**: Gestión de sus productos
- **Compradores**: Acceso al catálogo
- **Moderadores**: Control de calidad

### 3. Sistema de Gestión
- **Usuarios**: Acceso a funcionalidades básicas
- **Managers**: Gestión de operaciones
- **Administradores**: Configuración y monitoreo

---

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- [ ] Autenticación de dos factores (2FA)
- [ ] Login social (Google, Facebook)
- [ ] Recuperación de contraseña por email
- [ ] Verificación de email
- [ ] Gestión de sesiones múltiples
- [ ] Logs de auditoría avanzados

### Mejoras de Seguridad
- [ ] Rate limiting por IP
- [ ] Detección de comportamiento sospechoso
- [ ] Bloqueo temporal de cuentas
- [ ] Notificaciones de seguridad

---

## 📞 Soporte

### Contacto Técnico
- **Email**: soporte@solecitocrochet.com
- **WhatsApp**: +505 1234-5678
- **Documentación**: docs.solecitocrochet.com

### Recursos Adicionales
- [Guía de Desarrollador](./DEVELOPER_GUIDE.md)
- [Referencia de API](./API_REFERENCE.md)
- [Ejemplos de SDK](./SDK_EXAMPLES.md)

---

*Documentación del Sistema de Autenticación - Solecito Crochet API v1.0.0*
