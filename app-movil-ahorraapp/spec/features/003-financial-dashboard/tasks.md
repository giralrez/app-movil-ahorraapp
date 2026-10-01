
## `tasks.md`

```markdown
# Feature 003 — Tasks

- [x] Crear dashboard container. (Principal.js — contenedor con datos del DashboardService)
- [x] Crear BalanceCard.
- [x] Crear IncomeExpenseSummary.
- [x] Crear SavingsRate.
- [x] Crear selector temporal. (actual / anterior / personalizado)
- [x] Crear CategoryChart.
- [x] Crear MonthlyTrend.
- [x] Crear RecentTransactions.
- [x] Crear estados vacíos. (EmptyState en CategoryChart, MonthlyTrend y RecentTransactions)
- [x] Validar cálculos. (FinancialSelectors.test + DashboardService.test)
- [x] Validar responsive. (grid auto-fit + media query 768px)
- [x] Optimizar renderizado. (useMemo en periodo/dashboard, useCallback en navegación)

## Nota de alcance (decisión aprobada — opción A)

Los tasks originales `BudgetSummary` y `GoalsSummary` fueron **movidos a la
Feature 005 (Budgets and Savings Goals)**: la spec de 003 los listaba pero
`roadmap.md` los asigna a 005 (prioridad P1) y aún no existe persistencia
de presupuestos/metas. Se re-integran allí con su flujo de datos completo.
```
