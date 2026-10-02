import { aFechaLocal } from '../../utils/dates';

export function calcularMeta(meta, hoy = new Date()) {
  const montoActual = meta.montoActual || 0;
  const progreso =
    meta.montoObjetivo > 0 ? (montoActual / meta.montoObjetivo) * 100 : 0;
  const restante = Math.max(0, meta.montoObjetivo - montoActual);
  const completada = montoActual >= meta.montoObjetivo;

  let diasRestantes = null;
  let estado = completada ? 'completada' : 'en curso';
  if (meta.fechaLimite) {
    diasRestantes = Math.round(
      (aFechaLocal(meta.fechaLimite) - aFechaLocal(hoy)) / 86400000
    );
    if (!completada && diasRestantes < 0) {
      estado = 'vencida';
    }
  }

  return { progreso, restante, completada, diasRestantes, estado };
}

export function metasConProgreso(metas, hoy = new Date()) {
  return metas.map((m) => ({ ...m, ...calcularMeta(m, hoy) }));
}
