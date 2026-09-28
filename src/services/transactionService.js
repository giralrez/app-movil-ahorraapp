import { createTransaction, isValidTransaction } from '../domain/transactions';
import { getTransacciones, setTransacciones } from './storage/storageService';

export function getTransactions() {
  return getTransacciones();
}

export function addTransaction(datos) {
  const transaccion = createTransaction(datos);
  if (!isValidTransaction(transaccion)) {
    throw new Error('Transacción inválida');
  }
  const lista = getTransacciones();
  lista.push(transaccion);
  setTransacciones(lista);
  return transaccion;
}