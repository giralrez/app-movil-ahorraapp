globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('../../services/storage/storageService', () => ({
  getUsuario: jest.fn(),
  setUsuario: jest.fn(),
  getTransacciones: jest.fn(),
  setTransacciones: jest.fn()
}));

jest.mock('../../services/transactionService', () => ({
  getTransactions: jest.fn(),
  addTransaction: jest.fn()
}));

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useApp } from './AppContext';
import * as storageService from '../../services/storage/storageService';
import * as transactionService from '../../services/transactionService';

function montarProvider() {
  let contexto;
  function Probe() {
    contexto = useApp();
    return null;
  }
  function Provider() {
    return (
      <AppProvider>
        <Probe />
      </AppProvider>
    );
  }

  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);

  act(() => {
    createRoot(contenedor).render(<Provider />);
  });

  return { obtenerContexto: () => contexto };
}

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.getUsuario.mockReturnValue('');
    transactionService.getTransactions.mockReturnValue([]);
  });

  test('carga inicial desde storage (lazy init)', () => {
    storageService.getUsuario.mockReturnValue('Ana');
    transactionService.getTransactions.mockReturnValue([{ tipo: 'ingreso', monto: 500 }]);

    const { obtenerContexto } = montarProvider();

    expect(obtenerContexto().usuario).toBe('Ana');
    expect(obtenerContexto().transacciones).toEqual([{ tipo: 'ingreso', monto: 500 }]);
  });

  test('guardarUsuario persiste y actualiza el estado', () => {
    const { obtenerContexto } = montarProvider();

    act(() => {
      obtenerContexto().guardarUsuario('Luis');
    });

    expect(storageService.setUsuario).toHaveBeenCalledWith('Luis');
    expect(obtenerContexto().usuario).toBe('Luis');
  });

  test('agregarTransaccion exitosa actualiza transacciones', () => {
    transactionService.addTransaction.mockReturnValue({ tipo: 'gasto', monto: 20 });
    transactionService.getTransactions.mockReturnValue([]);
    const { obtenerContexto } = montarProvider();

    let resultado;
    act(() => {
      transactionService.getTransactions.mockReturnValue([{ tipo: 'gasto', monto: 20 }]);
      resultado = obtenerContexto().agregarTransaccion({ tipo: 'gasto', monto: 20, fecha: '2026-09-27' });
    });

    expect(resultado.ok).toBe(true);
    expect(transactionService.addTransaction).toHaveBeenCalled();
    expect(obtenerContexto().transacciones).toEqual([{ tipo: 'gasto', monto: 20 }]);
  });

  test('agregarTransaccion expone error si el servicio falla', () => {
    transactionService.addTransaction.mockImplementation(() => {
      throw new Error('Transacción inválida');
    });
    const { obtenerContexto } = montarProvider();

    let resultado;
    act(() => {
      resultado = obtenerContexto().agregarTransaccion({ tipo: 'gasto', monto: -5 });
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.error).toBe('Transacción inválida');
  });

  test('useApp lanza error sin AppProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    function SinProvider() {
      useApp();
      return null;
    }

    const contenedor = document.createElement('div');
    document.body.appendChild(contenedor);

    expect(() => {
      act(() => {
        createRoot(contenedor).render(<SinProvider />);
      });
    }).toThrow('useApp debe usarse dentro de <AppProvider>');

    spy.mockRestore();
  });
});
