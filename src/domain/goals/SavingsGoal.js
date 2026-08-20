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
    montoActualValido
  );
}

export function createSavingsGoal({ nombre, montoObjetivo, montoActual = 0, fechaLimite = null, id = null } = {}) {
  return {
    id,
    nombre: typeof nombre === 'string' ? nombre.trim() : nombre,
    montoObjetivo,
    montoActual,
    fechaLimite
  };
}