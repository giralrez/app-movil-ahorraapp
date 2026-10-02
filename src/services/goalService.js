import { createSavingsGoal, isValidSavingsGoal } from '../domain/goals';
import { generarId } from '../domain/idGenerator';
import { getMetas, setMetas } from './storage/storageService';

function migrarIds(lista) {
  let cambia = false;
  const migrada = lista.map((m) => {
    if (m && m.id) return m;
    cambia = true;
    return { ...(m || {}), id: generarId() };
  });
  if (cambia) setMetas(migrada);
  return migrada;
}

function montoAportable(monto) {
  return typeof monto === 'number' && Number.isFinite(monto) && monto > 0;
}

function modificarMontoActual(id, operacion, monto) {
  if (!montoAportable(monto)) {
    throw new Error('Monto inválido');
  }
  const lista = getGoals();
  const indice = lista.findIndex((m) => m.id === id);
  if (indice === -1) {
    throw new Error('Meta no encontrada');
  }
  const meta = lista[indice];
  const saldo = meta.montoActual || 0;
  if (operacion === 'restar' && monto > saldo) {
    throw new Error('Saldo insuficiente');
  }
  const delta = operacion === 'sumar' ? monto : -monto;
  const nuevoMonto = Math.max(0, saldo + delta);
  const actualizada = createSavingsGoal({ ...meta, montoActual: nuevoMonto, id });
  if (!isValidSavingsGoal(actualizada)) {
    throw new Error('Meta inválida');
  }
  const nueva = [...lista];
  nueva[indice] = actualizada;
  setMetas(nueva);
  return actualizada;
}

export function getGoals() {
  return migrarIds(getMetas());
}

export function addGoal(datos) {
  const meta = createSavingsGoal(datos);
  if (!isValidSavingsGoal(meta)) {
    throw new Error('Meta inválida');
  }
  const lista = getGoals();
  lista.push(meta);
  setMetas(lista);
  return meta;
}

export function updateGoal(id, cambios) {
  const lista = getGoals();
  const indice = lista.findIndex((m) => m.id === id);
  if (indice === -1) {
    throw new Error('Meta no encontrada');
  }
  const actualizada = createSavingsGoal({ ...lista[indice], ...cambios, id });
  if (!isValidSavingsGoal(actualizada)) {
    throw new Error('Meta inválida');
  }
  const nueva = [...lista];
  nueva[indice] = actualizada;
  setMetas(nueva);
  return actualizada;
}

export function deleteGoal(id) {
  const lista = getGoals();
  const nueva = lista.filter((m) => m.id !== id);
  if (nueva.length === lista.length) {
    throw new Error('Meta no encontrada');
  }
  setMetas(nueva);
}

export function contributeToGoal(id, monto) {
  return modificarMontoActual(id, 'sumar', monto);
}

export function withdrawFromGoal(id, monto) {
  return modificarMontoActual(id, 'restar', monto);
}
