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

  describe('getTransactions + migración de ids', () => {
    test('asigna ids a datos legacy y persiste la migración', () => {
      const legacy = [
        { tipo: 'ingreso', categoria: 'Salario', monto: 100, fecha: '2024-01-15', id: null }
      ];
      storageService.getTransacciones.mockReturnValue(legacy);

      const resultado = transactionService.getTransactions();

      expect(resultado[0].id).toEqual(expect.any(String));
      expect(resultado[0].id.length).toBeGreaterThan(0);
      expect(storageService.setTransacciones).toHaveBeenCalledWith(resultado);
    });

    test('no persiste cuando todos tienen id', () => {
      const lista = [{ tipo: 'gasto', id: 'x1' }];
      storageService.getTransacciones.mockReturnValue(lista);

      expect(transactionService.getTransactions()).toEqual(lista);
      expect(storageService.setTransacciones).not.toHaveBeenCalled();
    });
  });

  describe('addTransaction', () => {
    test('valida, genera id y persiste', () => {
      storageService.getTransacciones.mockReturnValue([]);
      const datos = { tipo: 'ingreso', categoria: 'Salario', monto: 1000, fecha: '2024-01-15' };

      const resultado = transactionService.addTransaction(datos);

      expect(resultado).toMatchObject(datos);
      expect(resultado.id).toEqual(expect.any(String));
      expect(storageService.setTransacciones).toHaveBeenCalledWith([
        expect.objectContaining({ ...datos, id: resultado.id })
      ]);
    });

    test('rechaza monto inválido', () => {
      const datos = { tipo: 'ingreso', categoria: 'Salario', monto: -100, fecha: '2024-01-15' };
      expect(() => transactionService.addTransaction(datos)).toThrow('Transacción inválida');
      expect(storageService.setTransacciones).not.toHaveBeenCalled();
    });

    test('rechaza tipo inválido', () => {
      const datos = { tipo: 'transferencia', categoria: 'Salario', monto: 100, fecha: '2024-01-15' };
      expect(() => transactionService.addTransaction(datos)).toThrow('Transacción inválida');
    });

    test('rechaza fecha inválida', () => {
      const datos = { tipo: 'ingreso', categoria: 'Salario', monto: 100, fecha: '15/01/2024' };
      expect(() => transactionService.addTransaction(datos)).toThrow('Transacción inválida');
    });
  });

  describe('updateTransaction', () => {
    const conId = { id: 't1', tipo: 'gasto', categoria: 'Comida', monto: 50, fecha: '2024-01-10', metodoPago: '', descripcion: '' };

    test('actualiza campos y conserva el id', () => {
      storageService.getTransacciones.mockReturnValue([conId]);

      const actualizada = transactionService.updateTransaction('t1', { monto: 75, descripcion: 'Cena' });

      expect(actualizada.id).toBe('t1');
      expect(actualizada.monto).toBe(75);
      expect(actualizada.descripcion).toBe('Cena');
      expect(storageService.setTransacciones).toHaveBeenCalledWith([expect.objectContaining({ id: 't1', monto: 75 })]);
    });

    test('lanza si el id no existe', () => {
      storageService.getTransacciones.mockReturnValue([conId]);
      expect(() => transactionService.updateTransaction('no-existe', { monto: 10 })).toThrow('Transacción no encontrada');
    });

    test('lanza si los cambios dejan la transacción inválida', () => {
      storageService.getTransacciones.mockReturnValue([conId]);
      expect(() => transactionService.updateTransaction('t1', { monto: -5 })).toThrow('Transacción inválida');
      expect(storageService.setTransacciones).not.toHaveBeenCalled();
    });
  });

  describe('deleteTransaction', () => {
    const conId = { id: 't1', tipo: 'gasto', categoria: 'Comida', monto: 50, fecha: '2024-01-10' };

    test('elimina la transacción indicada', () => {
      storageService.getTransacciones.mockReturnValue([conId, { ...conId, id: 't2' }]);

      transactionService.deleteTransaction('t1');

      expect(storageService.setTransacciones).toHaveBeenCalledWith([expect.objectContaining({ id: 't2' })]);
    });

    test('lanza si el id no existe', () => {
      storageService.getTransacciones.mockReturnValue([conId]);
      expect(() => transactionService.deleteTransaction('no-existe')).toThrow('Transacción no encontrada');
      expect(storageService.setTransacciones).not.toHaveBeenCalled();
    });
  });
});
