
## `plan.md`

```markdown
# Feature 003 — Implementation Plan

## Arquitectura

```text
TransactionService
       ↓
AppContext (estado reactivo)
       ↓
FinancialSelectors (puros, testeados)
       ↓
DashboardService
       ↓
React Components (Principal + components/financial/)
```

## Notas

- `AppContext` media entre `TransactionService` y los selectors: los componentes
  reciben arrays crudos desde el contexto (no hay dependencia directa
  TransactionService → FinancialSelectors).
- La tendencia de 6 meses es un dato global (independiente del período):
  el contenedor la memoiza aparte con `useMemo(..., [transacciones])` para
  evitar destruir/recrear el gráfico al cambiar de período.
- Alcance aprobado (opción A): sin metas/presupuestos — van en la
  Feature 005.
```
