
## `tasks.md`

```markdown
# Feature 005 — Tasks

- [x] Crear Budget model. (dominio con generarId y validación de categoría opcional)
- [x] Crear SavingsGoal model. (id, montoActual/fechaLimite validados)
- [x] Crear budgetService. (get/add/update/delete + migración de ids legacy)
- [x] Crear goalService. (get/add/update/delete + aportar/retirar con validación de saldo)
- [x] Crear BudgetCard. (components/financial, badge de estado y acciones)
- [x] Crear BudgetProgress. (ProgressBar invertido: verde <80%, naranja ≥80%, rojo ≥100%)
- [x] Crear BudgetForm. (nombre, categoría o global, límite, período; inline en /presupuestos)
- [x] Crear SavingsGoalCard. (progreso, días restantes, acciones Editar/Aportar/Eliminar)
- [x] Crear GoalProgress. (progreso y "Meta alcanzada" al 100%)
- [x] Crear GoalForm. (nombre, objetivo, fecha límite con min; inline en /metas)
- [x] Crear ContributionForm. (aportar/retirar manuales, saldo disponible a la vista)
- [x] Implementar cálculo automático. (spent = gastos reales por categoría+período; no se persiste)
- [x] Implementar estados. (presupuesto: ok/alerta/superado; meta: en curso/completada/vencida)
- [x] Integrar transacciones. (ventanas mensual/semanal/anual calculadas sobre transacciones)
- [x] Integrar dashboard. (sección "Mi planificación" + resumen aria-live de presupuestos en alerta)
- [x] Agregar tests. (200 tests: dominio, cálculos, services, contexto y páginas)

## Notas de alcance (decisiones aprobadas)

- **Presupuestos con categoría o global**: `categoria: null` aplica a todo el gasto.
- **Aportes manuales**: no generan transacciones; `aportarAMeta`/`retirarDeMeta`
  ajustan `montoActual` y validan saldo (`Saldo insuficiente`).
- **Alertas en tarjeta + dashboard**: umbral compartido `UMBRAL_ALERTA` (80%) en
  `utils/financial`, barra de progreso invertida y resumen en Principal.
- **spent/remaining/percentageUsed son derivados** (regla del plan: no se persisten).
- **Formularios inline** en las páginas de lista (sin rutas propias), con `key`
  por id para remontar al cambiar de edición.
- `spec.md` truncado (preexistente): se mantienen nombres en español
  (`categoria`, `montoLimite`, `montoObjetivo`) y los campos derivados del árbol
  Budget se calculan en `features/budgets/BudgetCalculations`.
- `generarId` se extrajo a `src/domain/idGenerator.js` compartido con transacciones.
```
