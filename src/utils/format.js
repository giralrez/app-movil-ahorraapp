const formateadorCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

export function formatCurrency(monto) {
  if (monto === null || monto === undefined || monto === '') return '$ 0';
  const numero = Number(monto);
  if (!Number.isFinite(numero)) return '$ 0';
  return formateadorCOP.format(numero);
}