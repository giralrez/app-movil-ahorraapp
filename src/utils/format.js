const formateadorCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

const formateadorMontoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

export function formatCurrency(monto) {
  if (monto === null || monto === undefined || monto === '') return '$ 0';
  const numero = Number(monto);
  if (!Number.isFinite(numero)) return '$ 0';
  return formateadorCOP.format(numero);
}

export function formatAmount(monto) {
  if (monto === null || monto === undefined || monto === '') return '';
  const numero = Number(monto);
  if (!Number.isFinite(numero)) return '';
  return formateadorMontoCOP.format(numero);
}