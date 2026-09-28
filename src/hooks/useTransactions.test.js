globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('../services/transactionService', () => ({
  getTransactions: jest.fn()
}));

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useTransactions } from './useTransactions';
import * as transactionService from '../services/transactionService';

function montarHook() {
  let valor;
  function Componente() {
    valor = useTransactions();
    return null;
  }
  return { Componente, obtenerValor: () => valor };
}

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('carga transacciones al montar', () => {
    const lista = [{ tipo: 'ingreso', monto: 100 }];
    transactionService.getTransactions.mockReturnValue(lista);

    const { Componente, obtenerValor } = montarHook();
    const contenedor = document.createElement('div');
    document.body.appendChild(contenedor);

    act(() => {
      createRoot(contenedor).render(<Componente />);
    });

    expect(obtenerValor()).toEqual(lista);
  });

  test('devuelve lista vacia si no hay datos', () => {
    transactionService.getTransactions.mockReturnValue([]);

    const { Componente, obtenerValor } = montarHook();
    const contenedor = document.createElement('div');
    document.body.appendChild(contenedor);

    act(() => {
      createRoot(contenedor).render(<Componente />);
    });

    expect(obtenerValor()).toEqual([]);
  });
});