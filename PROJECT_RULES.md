# Reglas y Checklist del Proyecto - API de Talento Humano

## 📋 Arquitectura y Estructura

### ✅ Arquitectura Limpia (Clean Architecture)
- **Capa de Dominio**: Entidades, enums, interfaces y utilidades del negocio
- **Capa de Aplicación**: Casos de uso, DTOs y servicios de aplicación
- **Capa de Infraestructura**: Repositorios, servicios externos y configuración
- **Capa de Presentación**: Controladores, routers, middleware y validadores

### ✅ Patrón Repository
- Implementar interfaces en `domain/interfaces/repositories/`
- Implementar repositorios en `infrastructure/persistence/repositories/`
- Usar `PrismaRepository` como base para repositorios

### ✅ DTOs y Validación
- Crear DTOs en `application/use-cases/{module}/v1/Dto/`
- Usar validadores en `presentation/middleware/validators/{module}/`
- Validar parámetros críticos en controladores (UUIDs, IDs)

## 🔧 Reglas de Desarrollo

### ✅ Nuevos Endpoints
Para endpoints **NUEVOS** implementar:

1. **Validación de parámetros críticos en controlador**:
```typescript
// Validar UUIDs y parámetros críticos
if (!isUUID(collaborator_id)) {
    return res.status(400).json({
        status: 'error',
        message: 'ID de colaborador inválido'
    });
}
```

2. **Return statements después de respuestas**:
```typescript
// Siempre usar return después de res.json() o res.status()
return res.status(200).json({
    status: 'success',
    data: result
});
```

### ✅ Estados y Enums
- **Usar RequestStatusEnum** para todos los módulos de solicitudes
- Estados estándar: `PENDING`, `ACTIVE`, `FINISHED`, `CANCELLED`, `DELETED`
- Usar `RequestStatusValidationService` para validaciones de estado
- **NO duplicar lógica de validación** en controladores

### ✅ Manejo de Errores
- Usar `ErrorResult` para errores de dominio
- Implementar try-catch en controladores
- Usar `next(error)` para errores de Express
- Validar tipos y parámetros antes de procesar

## 📝 Documentación

### ✅ Swagger
- Documentar todos los endpoints con `@swagger`
- Incluir ejemplos de request/response
- Documentar códigos de error (400, 500)
- Crear archivos JSON de documentación en `docs/{module}/`

### ✅ Comentarios
- Comentar funciones complejas
- Documentar lógica de negocio importante
- Explicar cálculos y fórmulas

## 🧪 Testing y Validación

### ✅ Validadores
- Crear validadores para cada endpoint
- Validar tipos de datos (string, number, UUID)
- Validar rangos y formatos de fechas
- Validar relaciones entre entidades

### ✅ Casos de Uso
- Implementar casos de uso en `application/use-cases/`
- Separar comandos (mutaciones) de queries (consultas)
- Usar DTOs para entrada y salida

## 🔄 Lógica de Negocio

### ✅ Sistema de Estados Reutilizable
- **Usar RequestStatusEnum** para todos los módulos
- **Usar RequestStatusValidationService** para validaciones
- **NO duplicar lógica** de validación de estados
- Estados coherentes: `PENDING` → `ACTIVE` → `FINISHED`

### ✅ Vacaciones
- **No modificar fecha de inicio** en ningún módulo
- Respetar cálculo de días con factor 0.0833
- Manejar reversión y recálculo en ediciones
- Registrar movimientos en historial de vacaciones

### ✅ Estados de Solicitudes
- **PENDING**: No editable
- **ACTIVE**: Solo extender fecha fin
- **FINISHED**: Solo motivo
- **CANCELLED**: No editable

### ✅ Casos de Edición
1. **Pasado**: Solo editar motivo
2. **En curso**: Solo extender fecha de fin
3. **Futuro**: Modificar fechas y motivo libremente

## 🚀 Checklist para Nuevas Funcionalidades

### ✅ Antes de Implementar
- [ ] Revisar arquitectura existente
- [ ] Identificar enums y estados necesarios
- [ ] Planificar DTOs y validadores
- [ ] Documentar lógica de negocio

### ✅ Durante la Implementación
- [ ] Crear interfaces de repositorio
- [ ] Implementar repositorio con Prisma
- [ ] Crear casos de uso (comandos/queries)
- [ ] Implementar validadores
- [ ] Crear controlador con manejo de errores
- [ ] Configurar rutas en router
- [ ] Documentar con Swagger

### ✅ Después de Implementar
- [ ] Validar tipos TypeScript
- [ ] Probar endpoints manualmente
- [ ] Verificar documentación Swagger
- [ ] Revisar manejo de errores
- [ ] Validar lógica de negocio

## 🔍 Revisión de Código

### ✅ Checklist de Revisión
- [ ] ¿Sigue la arquitectura limpia?
- [ ] ¿Tiene validación de parámetros críticos?
- [ ] ¿Usa return statements correctamente?
- [ ] ¿Maneja errores apropiadamente?
- [ ] ¿Está documentado con Swagger?
- [ ] ¿Respeta la lógica de vacaciones?
- [ ] ¿Usa RequestStatusEnum y RequestStatusValidationService?
- [ ] ¿NO duplica lógica de validación de estados?

## 📚 Referencias

### ✅ Archivos Importantes
- `src/domain/enums/request-status.enum.ts` - Enum reutilizable de estados
- `src/application/common/services/request-status-validation.service.ts` - Servicio de validación
- `src/domain/enums/` - Estados y enumeraciones
- `src/application/use-cases/` - Lógica de aplicación
- `src/infrastructure/persistence/repositories/` - Acceso a datos
- `src/presentation/controllers/` - Controladores HTTP
- `src/presentation/middleware/validators/` - Validación de entrada
- `src/presentation/routers/` - Configuración de rutas

### ✅ Utilidades
- `src/domain/utils/vacation-calculator.ts` - Cálculo de vacaciones
- `src/infrastructure/errors/format-error.ts` - Formato de errores
- `src/application/common/utils/` - Utilidades comunes

### ✅ Documentación
- `docs/REQUEST_STATUS_SYSTEM.md` - Sistema de estados reutilizable
- `PROJECT_RULES.md` - Reglas del proyecto

---

**Nota**: Este documento debe actualizarse conforme evolucione el proyecto y se agreguen nuevas reglas o patrones. 