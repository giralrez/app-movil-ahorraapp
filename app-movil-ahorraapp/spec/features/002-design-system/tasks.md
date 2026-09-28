# Feature 002 — Tasks

- [x] Auditar UI existente.
- [x] Crear design tokens.
- [x] Definir paleta.
- [x] Definir tipografía.
- [x] Definir spacing scale.
- [x] Definir border radius.
- [x] Crear Button.
- [x] Crear Card.
- [x] Crear Input.
- [x] Crear FinancialMetric.
- [x] Crear TransactionItem.
- [x] Crear ProgressBar.
- [x] Crear EmptyState.
- [x] Crear LoadingState.
- [x] Crear ErrorState.
- [x] Crear navegación.
- [x] Validar accesibilidad.
- [x] Validar responsive.

## Notas de cierre

- Componentes extra del spec UI-002 también creados: `Select`, `AmountInput`, `Icon`.
- Estados UI-006 implementados en `ui.css`: default, pressed (:active),
  disabled, loading, success, error, empty.
- Contraste WCAG AA corregido en tokens (income `#00784c`, expense `#c93a2c`,
  botones primary/income/success/ghost, gray-500 `#767676`).
- `LoadingState` y `ErrorState` quedan exportados y listos; aún no se usan en
  pantallas porque no existe flujo asíncrono (storage es síncrono). Se
  integrarán en features con carga/red.
- Barra/tabs de navegación persistente: fuera del alcance de esta feature
  (pendiente de decisión de producto).
