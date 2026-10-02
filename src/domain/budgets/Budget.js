import { generarId } from '../idGenerator';

export const PERIODOS_PRESUPUESTO = ['mensual', 'semanal', 'anual'];

export function isValidBudget(presupuesto) {
  if (!presupuesto || typeof presupuesto !== 'object') return false;
  const categoriaValida =
    presupuesto.categoria === null ||
    (typeof presupuesto.categoria === 'string' && presupuesto.categoria.trim().length > 0);
  return (
    typeof presupuesto.nombre === 'string' &&
    presupuesto.nombre.trim().length > 0 &&
    typeof presupuesto.montoLimite === 'number' &&
    Number.isFinite(presupuesto.montoLimite) &&
    presupuesto.montoLimite > 0 &&
    PERIODOS_PRESUPUESTO.includes(presupuesto.periodo) &&
    categoriaValida
  );
}

export function createBudget({ nombre, montoLimite, periodo, categoria = null, id } = {}) {
  return {
    id: id ?? generarId(),
    nombre: typeof nombre === 'string' ? nombre.trim() : nombre,
    categoria: categoria === null || categoria === undefined ? null : categoria,
    montoLimite,
    periodo
  };
}
