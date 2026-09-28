import React, { createContext, useContext, useState } from 'react';
import { getUsuario, setUsuario as setUsuarioStorage } from '../../services/storage/storageService';
import { getTransactions, addTransaction } from '../../services/transactionService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(() => getUsuario());
  const [transacciones, setTransacciones] = useState(() => getTransactions());

  const guardarUsuario = (nombre) => {
    setUsuarioStorage(nombre);
    setUsuario(nombre);
  };

  const agregarTransaccion = (datos) => {
    try {
      const creada = addTransaction(datos);
      setTransacciones(getTransactions());
      return { ok: true, transaccion: creada };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  const valor = {
    usuario,
    guardarUsuario,
    transacciones,
    agregarTransaccion
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
