export const PERIODOS_PRESUPUESTO = ['mensual', 'semanal', 'anual'];

export function isValidBudget(presupuesto) {
  if (!presupuesto || typeof presupuesto !== 'object') return false;
  return (
    typeof presupuesto.nombre === 'string' &&
    presupuesto.nombre.trim().length > 0 &&
    typeof presupuesto.montoLimite === 'number' &&
    Number.isFinite(presupuesto.montoLimite) &&
    presupuesto.montoLimite > 0 &&
    PERIODOS_PRESUPUESTO.includes(presupuesto.periodo)
  );
}

export function createBudget({ nombre, montoLimite, periodo, categoria = null, id = null } = {}) {
  return {
    id,
    nombre: typeof nombre === 'string' ? nombre.trim() : nombre,
    categoria,
    montoLimite,
    periodo
  };
}