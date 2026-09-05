import { TIPOS_TRANSACCION } from './transactionTypes';

export const CAMPOS_TRANSACCION = ['tipo', 'categoria', 'monto', 'fecha'];

export function esFechaValida(fecha) {
  if (typeof fecha !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

export function esMontoValido(monto) {
  return typeof monto === 'number' && Number.isFinite(monto) && monto > 0;
}

export function isValidTransaction(transaccion) {
  if (!transaccion || typeof transaccion !== 'object') return false;
  return (
    TIPOS_TRANSACCION.includes(transaccion.tipo) &&
    typeof transaccion.categoria === 'string' &&
    transaccion.categoria.trim().length > 0 &&
    esMontoValido(transaccion.monto) &&
    esFechaValida(transaccion.fecha)
  );
}

export function createTransaction({ tipo, categoria, monto, fecha, id = null } = {}) {
  const transaccion = {
    tipo,
    categoria: typeof categoria === 'string' ? categoria.trim() : categoria,
    monto,
    fecha,
    id
  };
  return transaccion;
}