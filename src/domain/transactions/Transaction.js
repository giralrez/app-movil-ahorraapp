import { TIPOS_TRANSACCION } from './transactionTypes';
import { esMetodoPagoValido } from './paymentMethods';
import { generarId } from '../idGenerator';

export { generarId };

export const CAMPOS_TRANSACCION = ['tipo', 'categoria', 'monto', 'fecha'];
export const CAMPOS_OPCIONALES_TRANSACCION = ['metodoPago', 'descripcion'];

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
    esFechaValida(transaccion.fecha) &&
    (transaccion.metodoPago === undefined || esMetodoPagoValido(transaccion.metodoPago)) &&
    (transaccion.descripcion === undefined || typeof transaccion.descripcion === 'string')
  );
}

export function createTransaction({
  tipo,
  categoria,
  monto,
  fecha,
  metodoPago = '',
  descripcion = '',
  id
} = {}) {
  const transaccion = {
    tipo,
    categoria: typeof categoria === 'string' ? categoria.trim() : categoria,
    monto,
    fecha,
    metodoPago: typeof metodoPago === 'string' ? metodoPago.trim() : metodoPago,
    descripcion: typeof descripcion === 'string' ? descripcion.trim() : descripcion,
    id: id ?? generarId()
  };
  return transaccion;
}