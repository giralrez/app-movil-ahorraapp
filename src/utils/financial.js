export function montoNumerico(monto) {
  const numero = Number(monto);
  return Number.isFinite(numero) ? numero : 0;
}

export function filtrarPorTipo(transacciones, tipo) {
  if (!Array.isArray(transacciones)) return [];
  return transacciones.filter((t) => t && t.tipo === tipo);
}

export function calculateIncome(transacciones) {
  return filtrarPorTipo(transacciones, 'ingreso').reduce(
    (suma, t) => suma + montoNumerico(t.monto),
    0
  );
}

export function calculateExpenses(transacciones) {
  return filtrarPorTipo(transacciones, 'gasto').reduce(
    (suma, t) => suma + montoNumerico(t.monto),
    0
  );
}

export function calculateBalance(transacciones) {
  return calculateIncome(transacciones) - calculateExpenses(transacciones);
}

export function calculateSavings(transacciones) {
  return calculateBalance(transacciones);
}

export function calculateSavingsRate(transacciones) {
  const ingresos = calculateIncome(transacciones);
  if (ingresos <= 0) return 0;
  return (calculateSavings(transacciones) / ingresos) * 100;
}