# Feature 001 — Architecture Foundation

## Objetivo

Refactorizar la estructura interna de Ahorrapp para separar UI, dominio, servicios y persistencia.

## Problema

Actualmente el proyecto concentra archivos en `src` y utiliza directamente `localStorage` desde `almacenamiento.js`.

Esto dificulta:

- testing;
- escalabilidad;
- mantenimiento;
- reutilización;
- migración futura de almacenamiento.

## Requerimientos

### RF-001

Crear estructura modular por features.

### RF-002

Crear una capa de servicios.

### RF-003

Crear modelos de dominio para:

- Transaction;
- Budget;
- SavingsGoal.

### RF-004

Centralizar operaciones monetarias.

### RF-005

Centralizar formateo de moneda.

### RF-006

Eliminar acceso directo a `localStorage` desde componentes.

### RF-007

Mantener compatibilidad con la funcionalidad actual.

## Criterios de aceptación

- [ ] Los componentes no acceden directamente a `localStorage`.
- [ ] Existe un servicio de persistencia.
- [ ] Las transacciones poseen un modelo consistente.
- [ ] Las operaciones monetarias están centralizadas.
- [ ] La aplicación continúa ejecutándose correctamente.
- [ ] No se eliminan datos existentes durante la refactorización.

## Restricciones

No migrar todavía a otro framework.

No introducir backend.

No realizar cambios visuales importantes dentro de esta feature.