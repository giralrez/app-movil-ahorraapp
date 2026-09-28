import * as transactionService from './transactionService';
import * as storageService from './storage/storageService';

jest.mock('./storage/storageService', () => ({
  getTransacciones: jest.fn(),
  setTransacciones: jest.fn()
}));

describe('transactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getTransactions devuelve la lista almacenada', () => {
    const lista = [{ tipo: 'ingreso', monto: 100 }];
    storageService.getTransacciones.mockReturnValue(lista);
    expect(transactionService.getTransactions()).toEqual(lista);
  });

  test('addTransaction valida y persiste una transaccion valida', () => {
    storageService.getTransacciones.mockReturnValue([]);
    const datos = { tipo: 'ingreso', categoria: 'Salario', monto: 1000, fecha: '2024-01-15' };

    const resultado = transactionService.addTransaction(datos);

    expect(resultado).toMatchObject(datos);
    expect(storageService.setTransacciones).toHaveBeenCalledWith([
      { ...datos, id: null }
    ]);
  });

  test('addTransaction rechaza monto invalido', () => {
    const datos = { tipo: 'ingreso', categoria: 'Salario', monto: -100, fecha: '2024-01-15' };
    expect(() => transactionService.addTransaction(datos)).toThrow('Transacción inválida');
    expect(storageService.setTransacciones).not.toHaveBeenCalled();
  });

  test('addTransaction rechaza tipo invalido', () => {
    const datos = { tipo: 'transferencia', categoria: 'Salario', monto: 100, fecha: '2024-01-15' };
    expect(() => transactionService.addTransaction(datos)).toThrow('Transacción inválida');
  });

  test('addTransaction rechaza fecha invalida', () => {
    const datos = { tipo: 'ingreso', categoria: 'Salario', monto: 100, fecha: '15/01/2024' };
    expect(() => transactionService.addTransaction(datos)).toThrow('Transacción inválida');
  });

  test('addTransaction anade a la lista existente', () => {
    const existentes = [{ tipo: 'gasto', categoria: 'Comida', monto: 300, fecha: '2024-01-10' }];
    storageService.getTransacciones.mockReturnValue(existentes);
    const datos = { tipo: 'ingreso', categoria: 'Salario', monto: 1000, fecha: '2024-01-15' };

    transactionService.addTransaction(datos);

    expect(storageService.setTransacciones).toHaveBeenCalledWith([
      { tipo: 'gasto', categoria: 'Comida', monto: 300, fecha: '2024-01-10' },
      { ...datos, id: null }
    ]);
  });
});