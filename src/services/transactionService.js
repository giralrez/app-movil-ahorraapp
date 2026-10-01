import { createTransaction, isValidTransaction, generarId } from '../domain/transactions';
import { getTransacciones, setTransacciones } from './storage/storageService';

function migrarIds(lista) {
  let cambia = false;
  const migrada = lista.map((t) => {
    if (t && t.id) return t;
    cambia = true;
    return { ...(t || {}), id: generarId() };
  });
  if (cambia) setTransacciones(migrada);
  return migrada;
}

export function getTransactions() {
  return migrarIds(getTransacciones());
}

export function addTransaction(datos) {
  const transaccion = createTransaction(datos);
  if (!isValidTransaction(transaccion)) {
    throw new Error('Transacción inválida');
  }
  const lista = getTransactions();
  lista.push(transaccion);
  setTransacciones(lista);
  return transaccion;
}

export function updateTransaction(id, cambios) {
  const lista = getTransactions();
  const indice = lista.findIndex((t) => t.id === id);
  if (indice === -1) {
    throw new Error('Transacción no encontrada');
  }
  const actualizada = createTransaction({ ...lista[indice], ...cambios, id });
  if (!isValidTransaction(actualizada)) {
    throw new Error('Transacción inválida');
  }
  const nueva = [...lista];
  nueva[indice] = actualizada;
  setTransacciones(nueva);
  return actualizada;
}

export function deleteTransaction(id) {
  const lista = getTransactions();
  const nueva = lista.filter((t) => t.id !== id);
  if (nueva.length === lista.length) {
    throw new Error('Transacción no encontrada');
  }
  setTransacciones(nueva);
}
