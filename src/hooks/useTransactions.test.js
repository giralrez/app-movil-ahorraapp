globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('../services/storage/storageService', () => ({
  getUsuario: jest.fn(),
  setUsuario: jest.fn(),
  getTransacciones: jest.fn(),
  setTransacciones: jest.fn()
}));

jest.mock('../services/transactionService', () => ({
  getTransactions: jest.fn(),
  addTransaction: jest.fn()
}));

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '../app/context/AppContext';
import { useTransactions } from './useTransactions';
import * as transactionService from '../services/transactionService';

function montarHook() {
  let valor;
  function Componente() {
    valor = useTransactions();
    return null;
  }
  function Provider() {
    return (
      <AppProvider>
        <Componente />
      </AppProvider>
    );
  }

  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);

  act(() => {
    createRoot(contenedor).render(<Provider />);
  });

  return { obtenerValor: () => valor };
}

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    transactionService.getTransactions.mockReturnValue([]);
  });

  test('carga transacciones al montar', () => {
    const lista = [{ tipo: 'ingreso', monto: 100 }];
    transactionService.getTransactions.mockReturnValue(lista);

    const { obtenerValor } = montarHook();

    expect(obtenerValor()).toEqual(lista);
  });

  test('devuelve lista vacia si no hay datos', () => {
    transactionService.getTransactions.mockReturnValue([]);

    const { obtenerValor } = montarHook();

    expect(obtenerValor()).toEqual([]);
  });
});
