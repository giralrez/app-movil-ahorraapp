import { filtrarPorTipo, UMBRAL_ALERTA } from '../../utils/financial';
import { aFechaLocal, cadenaFecha } from '../../utils/dates';

export { UMBRAL_ALERTA } from '../../utils/financial';
export { cadenaFecha };

export function inicioDePeriodo(periodo, hoy = new Date()) {
  const f = aFechaLocal(hoy);
  if (periodo === 'semanal') {
    const diasDesdeLunes = (f.getDay() + 6) % 7;
    f.setDate(f.getDate() - diasDesdeLunes);
  } else if (periodo === 'anual') {
    f.setMonth(0, 1);
  } else {
    f.setDate(1);
  }
  return cadenaFecha(f);
}

export function gastosDelPeriodo(transacciones, periodo, hoy = new Date()) {
  const inicio = inicioDePeriodo(periodo, hoy);
  const fin = cadenaFecha(hoy);
  return filtrarPorTipo(transacciones, 'gasto').filter(
    (t) => t.fecha >= inicio && t.fecha <= fin
  );
}

export function calcularPresupuesto(presupuesto, transacciones, hoy = new Date()) {
  const gastos = gastosDelPeriodo(transacciones, presupuesto.periodo, hoy).filter(
    (t) => !presupuesto.categoria || t.categoria === presupuesto.categoria
  );
  const spent = gastos.reduce((suma, t) => suma + t.monto, 0);
  const remaining = presupuesto.montoLimite - spent;
  const percentageUsed =
    presupuesto.montoLimite > 0 ? (spent / presupuesto.montoLimite) * 100 : 0;
  const estado =
    percentageUsed >= 100 ? 'superado' : percentageUsed >= UMBRAL_ALERTA ? 'alerta' : 'ok';
  return { spent, remaining, percentageUsed, estado };
}

export function presupuestosConProgreso(presupuestos, transacciones, hoy = new Date()) {
  return presupuestos.map((p) => ({ ...p, ...calcularPresupuesto(p, transacciones, hoy) }));
}

export function presupuestosEnAlerta(presupuestos, transacciones, hoy = new Date()) {
  return presupuestosConProgreso(presupuestos, transacciones, hoy).filter(
    (p) => p.estado !== 'ok'
  );
}
