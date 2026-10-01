import { calculateIncome, calculateExpenses, montoNumerico } from '../../utils/financial';

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function aISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function rangoMesActual(hoy = new Date()) {
  const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const ultimo = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  return { desde: aISO(primero), hasta: aISO(ultimo) };
}

export function rangoMesAnterior(hoy = new Date()) {
  const primero = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const ultimo = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
  return { desde: aISO(primero), hasta: aISO(ultimo) };
}

export function filtrarPorRango(transacciones, desde, hasta) {
  if (!Array.isArray(transacciones)) return [];
  const límiteInferior = desde || '0000-00-00';
  const límiteSuperior = hasta || '9999-12-31';
  return transacciones.filter(
    (t) => t && typeof t.fecha === 'string' && t.fecha >= límiteInferior && t.fecha <= límiteSuperior
  );
}

export function topCategorias(transacciones, limite = 3) {
  const gastos = Array.isArray(transacciones)
    ? transacciones.filter((t) => t && t.tipo === 'gasto')
    : [];

  const acumulado = new Map();
  for (const gasto of gastos) {
    const categoria = gasto.categoria || 'Otro';
    acumulado.set(categoria, (acumulado.get(categoria) || 0) + montoNumerico(gasto.monto));
  }

  return Array.from(acumulado, ([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limite);
}

export function ultimasTransacciones(transacciones, limite = 5) {
  if (!Array.isArray(transacciones)) return [];
  return [...transacciones]
    .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0))
    .slice(0, limite);
}

export function tendenciaMensual(transacciones, cantidadMeses = 6) {
  const hoy = new Date();
  const periodos = [];

  for (let i = cantidadMeses - 1; i >= 0; i--) {
    const primero = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const ultimo = new Date(hoy.getFullYear(), hoy.getMonth() - i + 1, 0);
    const desde = aISO(primero);
    const hasta = aISO(ultimo);
    const delMes = filtrarPorRango(transacciones, desde, hasta);

    periodos.push({
      etiqueta: MESES_CORTOS[primero.getMonth()],
      desde,
      hasta,
      ingresos: calculateIncome(delMes),
      gastos: calculateExpenses(delMes)
    });
  }

  return periodos;
}
