import React, { createContext, useContext, useState } from 'react';
import { getUsuario, setUsuario as setUsuarioStorage } from '../../services/storage/storageService';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../../services/transactionService';
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../../services/budgetService';
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  contributeToGoal,
  withdrawFromGoal
} from '../../services/goalService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(() => getUsuario());
  const [transacciones, setTransacciones] = useState(() => getTransactions());
  const [presupuestos, setPresupuestos] = useState(() => getBudgets());
  const [metas, setMetas] = useState(() => getGoals());

  const guardarUsuario = (nombre) => {
    setUsuarioStorage(nombre);
    setUsuario(nombre);
  };

  const ejecutar = (operacion, refrescar) => {
    try {
      const resultado = operacion();
      refrescar();
      return { ok: true, resultado };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  const agregarTransaccion = (datos) =>
    ejecutar(
      () => addTransaction(datos),
      () => setTransacciones(getTransactions())
    );

  const actualizarTransaccion = (id, cambios) =>
    ejecutar(
      () => updateTransaction(id, cambios),
      () => setTransacciones(getTransactions())
    );

  const eliminarTransaccion = (id) =>
    ejecutar(
      () => deleteTransaction(id),
      () => setTransacciones(getTransactions())
    );

  const agregarPresupuesto = (datos) =>
    ejecutar(
      () => addBudget(datos),
      () => setPresupuestos(getBudgets())
    );

  const actualizarPresupuesto = (id, cambios) =>
    ejecutar(
      () => updateBudget(id, cambios),
      () => setPresupuestos(getBudgets())
    );

  const eliminarPresupuesto = (id) =>
    ejecutar(
      () => deleteBudget(id),
      () => setPresupuestos(getBudgets())
    );

  const agregarMeta = (datos) =>
    ejecutar(
      () => addGoal(datos),
      () => setMetas(getGoals())
    );

  const actualizarMeta = (id, cambios) =>
    ejecutar(
      () => updateGoal(id, cambios),
      () => setMetas(getGoals())
    );

  const eliminarMeta = (id) =>
    ejecutar(
      () => deleteGoal(id),
      () => setMetas(getGoals())
    );

  const aportarAMeta = (id, monto) =>
    ejecutar(
      () => contributeToGoal(id, monto),
      () => setMetas(getGoals())
    );

  const retirarDeMeta = (id, monto) =>
    ejecutar(
      () => withdrawFromGoal(id, monto),
      () => setMetas(getGoals())
    );

  const valor = {
    usuario,
    guardarUsuario,
    transacciones,
    agregarTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
    presupuestos,
    agregarPresupuesto,
    actualizarPresupuesto,
    eliminarPresupuesto,
    metas,
    agregarMeta,
    actualizarMeta,
    eliminarMeta,
    aportarAMeta,
    retirarDeMeta
  };

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp() {
  const contexto = useContext(AppContext);
  if (!contexto) {
    throw new Error('useApp debe usarse dentro de <AppProvider>');
  }
  return contexto;
}
