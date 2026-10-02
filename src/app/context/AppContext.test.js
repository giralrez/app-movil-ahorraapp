globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('../../services/storage/storageService', () => ({
  getUsuario: jest.fn(),
  setUsuario: jest.fn(),
  getTransacciones: jest.fn(),
  setTransacciones: jest.fn()
}));

jest.mock('../../services/transactionService', () => ({
  getTransactions: jest.fn(),
  addTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn()
}));

jest.mock('../../services/budgetService', () => ({
  getBudgets: jest.fn(),
  addBudget: jest.fn(),
  updateBudget: jest.fn(),
  deleteBudget: jest.fn()
}));

jest.mock('../../services/goalService', () => ({
  getGoals: jest.fn(),
  addGoal: jest.fn(),
  updateGoal: jest.fn(),
  deleteGoal: jest.fn(),
  contributeToGoal: jest.fn(),
  withdrawFromGoal: jest.fn()
}));

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useApp } from './AppContext';
import * as storageService from '../../services/storage/storageService';
import * as transactionService from '../../services/transactionService';
import * as budgetService from '../../services/budgetService';
import * as goalService from '../../services/goalService';

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
    budgetService.getBudgets.mockReturnValue([]);
    goalService.getGoals.mockReturnValue([]);
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

  test('actualizarTransaccion persiste y refresca el estado', () => {
    transactionService.updateTransaction.mockReturnValue({ id: 't1', monto: 75 });
    transactionService.getTransactions.mockReturnValue([{ id: 't1', monto: 75 }]);
    const { obtenerContexto } = montarProvider();

    let resultado;
    act(() => {
      resultado = obtenerContexto().actualizarTransaccion('t1', { monto: 75 });
    });

    expect(resultado.ok).toBe(true);
    expect(transactionService.updateTransaction).toHaveBeenCalledWith('t1', { monto: 75 });
    expect(obtenerContexto().transacciones).toEqual([{ id: 't1', monto: 75 }]);
  });

  test('eliminarTransaccion quita la transacción del estado', () => {
    transactionService.getTransactions.mockReturnValue([{ id: 't1' }, { id: 't2' }]);
    const { obtenerContexto } = montarProvider();

    act(() => {
      transactionService.getTransactions.mockReturnValue([{ id: 't2' }]);
      const resultado = obtenerContexto().eliminarTransaccion('t1');
      expect(resultado.ok).toBe(true);
    });

    expect(transactionService.deleteTransaction).toHaveBeenCalledWith('t1');
    expect(obtenerContexto().transacciones).toEqual([{ id: 't2' }]);
  });

  test('carga inicial de presupuestos y metas', () => {
    budgetService.getBudgets.mockReturnValue([{ id: 'p1', nombre: 'Comida' }]);
    goalService.getGoals.mockReturnValue([{ id: 'm1', nombre: 'Viaje' }]);

    const { obtenerContexto } = montarProvider();

    expect(obtenerContexto().presupuestos).toEqual([{ id: 'p1', nombre: 'Comida' }]);
    expect(obtenerContexto().metas).toEqual([{ id: 'm1', nombre: 'Viaje' }]);
  });

  test('agregarPresupuesto exitoso actualiza el estado', () => {
    budgetService.addBudget.mockReturnValue({ id: 'p1', nombre: 'Comida' });
    const { obtenerContexto } = montarProvider();

    let resultado;
    act(() => {
      budgetService.getBudgets.mockReturnValue([{ id: 'p1', nombre: 'Comida' }]);
      resultado = obtenerContexto().agregarPresupuesto({
        nombre: 'Comida',
        montoLimite: 400,
        periodo: 'mensual'
      });
    });

    expect(resultado.ok).toBe(true);
    expect(budgetService.addBudget).toHaveBeenCalled();
    expect(obtenerContexto().presupuestos).toEqual([{ id: 'p1', nombre: 'Comida' }]);
  });

  test('agregarPresupuesto expone error si el servicio falla', () => {
    budgetService.addBudget.mockImplementation(() => {
      throw new Error('Presupuesto inválido');
    });
    const { obtenerContexto } = montarProvider();

    let resultado;
    act(() => {
      resultado = obtenerContexto().agregarPresupuesto({ nombre: '', montoLimite: 0 });
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.error).toBe('Presupuesto inválido');
  });

  test('aportarAMeta exitoso actualiza metas', () => {
    goalService.contributeToGoal.mockReturnValue({ id: 'm1', montoActual: 150 });
    const { obtenerContexto } = montarProvider();

    let resultado;
    act(() => {
      goalService.getGoals.mockReturnValue([{ id: 'm1', montoActual: 150 }]);
      resultado = obtenerContexto().aportarAMeta('m1', 50);
    });

    expect(resultado.ok).toBe(true);
    expect(goalService.contributeToGoal).toHaveBeenCalledWith('m1', 50);
    expect(obtenerContexto().metas).toEqual([{ id: 'm1', montoActual: 150 }]);
  });

  test('eliminarPresupuesto expone error si el servicio falla', () => {
    budgetService.deleteBudget.mockImplementation(() => {
      throw new Error('Presupuesto no encontrado');
    });
    const { obtenerContexto } = montarProvider();

    let resultado;
    act(() => {
      resultado = obtenerContexto().eliminarPresupuesto('inexistente');
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.error).toBe('Presupuesto no encontrado');
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
