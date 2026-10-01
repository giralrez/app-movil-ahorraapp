
## `tasks.md`

```markdown
# Feature 004 — Tasks

- [x] Definir Transaction model. (extendido: metodoPago y descripcion opcionales, generarId)
- [x] Crear categorías. (CATEGORIAS_INGRESO/CATEGORIAS_GASTO preexistentes, reutilizadas)
- [x] Crear métodos de pago. (domain/transactions/paymentMethods.js + validación en isValidTransaction)
- [x] Crear transactionService. (get/add/update/delete + migración automática de ids legacy)
- [x] Crear formulario. (FormularioMovimiento unificado; reemplaza a FormularioIngreso/FormularioGasto)
- [x] Crear AmountInput. (preexistente desde 002, reutilizado)
- [x] Implementar validación. (dominio + monto en formulario + método de pago)
- [x] Implementar creación. (ruta /movimiento con atajos /ingreso y /gasto)
- [x] Implementar edición. (ruta /movimiento?editar=<id> con precarga y estado no encontrado)
- [x] Implementar eliminación. (deleteTransaction + acción en Historial)
- [x] Agregar confirmación. (IonAlert con tipo, categoría, monto y fecha)
- [x] Crear historial. (página /historial con contador aria-live)
- [x] Crear búsqueda. (texto libre: categoría, descripción, método o fecha)
- [x] Crear filtros. (tipo, categoría y rango de fechas)
- [x] Crear ordenamiento. (fecha desc/asc, monto desc/asc)
- [x] Integrar dashboard. (botón "Ver historial" en Últimas transacciones)
- [x] Agregar tests. (97 tests: dominio, service, filtros, contexto y páginas)

## Notas de alcance (decisiones aprobadas)

- **Formulario único** `/movimiento` (selector de tipo) en lugar de dos formularios;
  `/ingreso` y `/gasto` quedan como atajos con tipo precargado.
- **Migración automática de ids**: las transacciones legacy (`id: null`) reciben
  id al leerse y se persisten una vez; `metodoPago`/`descripcion` son opcionales
  para no romper datos existentes.
- **Sin FAB**: el punto de entrada son los botones del dashboard (decisión de UX);
  el flujo del plan.md se conserva paso a paso.
- `spec.md` menciona `income/expense` como nombres canónicos: en el código se
  mantienen los valores vigentes `ingreso`/`gasto` (compatibilidad de datos).
```
