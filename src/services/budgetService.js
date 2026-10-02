import { createBudget, isValidBudget } from '../domain/budgets';
import { generarId } from '../domain/idGenerator';
import { getPresupuestos, setPresupuestos } from './storage/storageService';

function migrarIds(lista) {
  let cambia = false;
  const migrada = lista.map((p) => {
    if (p && p.id) return p;
    cambia = true;
    return { ...(p || {}), id: generarId() };
  });
  if (cambia) setPresupuestos(migrada);
  return migrada;
}

export function getBudgets() {
  return migrarIds(getPresupuestos());
}

export function addBudget(datos) {
  const presupuesto = createBudget(datos);
  if (!isValidBudget(presupuesto)) {
    throw new Error('Presupuesto inválido');
  }
  const lista = getBudgets();
  lista.push(presupuesto);
  setPresupuestos(lista);
  return presupuesto;
}

export function updateBudget(id, cambios) {
  const lista = getBudgets();
  const indice = lista.findIndex((p) => p.id === id);
  if (indice === -1) {
    throw new Error('Presupuesto no encontrado');
  }
  const actualizado = createBudget({ ...lista[indice], ...cambios, id });
  if (!isValidBudget(actualizado)) {
    throw new Error('Presupuesto inválido');
  }
  const nueva = [...lista];
  nueva[indice] = actualizado;
  setPresupuestos(nueva);
  return actualizado;
}

export function deleteBudget(id) {
  const lista = getBudgets();
  const nueva = lista.filter((p) => p.id !== id);
  if (nueva.length === lista.length) {
    throw new Error('Presupuesto no encontrado');
  }
  setPresupuestos(nueva);
}
