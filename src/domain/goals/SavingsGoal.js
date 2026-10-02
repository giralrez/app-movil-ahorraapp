import { generarId } from '../idGenerator';

export function esFechaLimiteValida(fecha) {
  if (fecha === null || fecha === undefined) return true;
  if (typeof fecha !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

export function isValidSavingsGoal(meta) {
  if (!meta || typeof meta !== 'object') return false;
  const montoObjetivoValido =
    typeof meta.montoObjetivo === 'number' &&
    Number.isFinite(meta.montoObjetivo) &&
    meta.montoObjetivo > 0;
  const montoActualValido =
    meta.montoActual === undefined ||
    (typeof meta.montoActual === 'number' &&
      Number.isFinite(meta.montoActual) &&
      meta.montoActual >= 0);
  return (
    typeof meta.nombre === 'string' &&
    meta.nombre.trim().length > 0 &&
    montoObjetivoValido &&
    montoActualValido &&
    esFechaLimiteValida(meta.fechaLimite)
  );
}

export function createSavingsGoal({ nombre, montoObjetivo, montoActual = 0, fechaLimite = null, id } = {}) {
  return {
    id: id ?? generarId(),
    nombre: typeof nombre === 'string' ? nombre.trim() : nombre,
    montoObjetivo,
    montoActual,
    fechaLimite: fechaLimite === undefined ? null : fechaLimite
  };
}
