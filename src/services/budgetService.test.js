import * as budgetService from './budgetService';
import * as storageService from './storage/storageService';

jest.mock('./storage/storageService', () => ({
  getPresupuestos: jest.fn(),
  setPresupuestos: jest.fn()
}));

const base = { nombre: 'Comida del mes', montoLimite: 400, periodo: 'mensual' };

describe('budgetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBudgets + migración de ids', () => {
    test('asigna ids a datos legacy y persiste la migración', () => {
      const legacy = [{ nombre: 'Luz', montoLimite: 80, periodo: 'mensual', id: null }];
      storageService.getPresupuestos.mockReturnValue(legacy);

      const resultado = budgetService.getBudgets();

      expect(resultado[0].id).toEqual(expect.any(String));
      expect(storageService.setPresupuestos).toHaveBeenCalledWith(resultado);
    });

    test('no persiste cuando todos tienen id', () => {
      const lista = [{ ...base, id: 'p1' }];
      storageService.getPresupuestos.mockReturnValue(lista);

      expect(budgetService.getBudgets()).toEqual(lista);
      expect(storageService.setPresupuestos).not.toHaveBeenCalled();
    });
  });

  describe('addBudget', () => {
    test('valida, genera id y persiste', () => {
      storageService.getPresupuestos.mockReturnValue([]);

      const resultado = budgetService.addBudget(base);

      expect(resultado).toMatchObject({ ...base, categoria: null });
      expect(resultado.id).toEqual(expect.any(String));
      expect(storageService.setPresupuestos).toHaveBeenCalledWith([
        expect.objectContaining({ ...base, id: resultado.id })
      ]);
    });

    test('rechaza límite no positivo', () => {
      expect(() =>
        budgetService.addBudget({ ...base, montoLimite: 0 })
      ).toThrow('Presupuesto inválido');
      expect(storageService.setPresupuestos).not.toHaveBeenCalled();
    });

    test('rechaza nombre vacío', () => {
      expect(() =>
        budgetService.addBudget({ ...base, nombre: '   ' })
      ).toThrow('Presupuesto inválido');
    });

    test('rechaza período desconocido', () => {
      expect(() =>
        budgetService.addBudget({ ...base, periodo: 'quincenal' })
      ).toThrow('Presupuesto inválido');
    });
  });

  describe('updateBudget', () => {
    test('actualiza solo el presupuesto indicado', () => {
      storageService.getPresupuestos.mockReturnValue([
        { ...base, id: 'p1' },
        { ...base, nombre: 'Transporte', id: 'p2' }
      ]);

      const resultado = budgetService.updateBudget('p1', { montoLimite: 500 });

      expect(resultado.montoLimite).toBe(500);
      expect(storageService.setPresupuestos).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'p1', montoLimite: 500 }),
        expect.objectContaining({ id: 'p2', montoLimite: 400 })
      ]);
    });

    test('lanza si no existe', () => {
      storageService.getPresupuestos.mockReturnValue([]);
      expect(() => budgetService.updateBudget('x', base)).toThrow('Presupuesto no encontrado');
    });

    test('lanza si los cambios lo invalidan', () => {
      storageService.getPresupuestos.mockReturnValue([{ ...base, id: 'p1' }]);
      expect(() =>
        budgetService.updateBudget('p1', { montoLimite: -1 })
      ).toThrow('Presupuesto inválido');
    });
  });

  describe('deleteBudget', () => {
    test('elimina el presupuesto indicado', () => {
      storageService.getPresupuestos.mockReturnValue([
        { ...base, id: 'p1' },
        { ...base, nombre: 'Transporte', id: 'p2' }
      ]);

      budgetService.deleteBudget('p1');

      expect(storageService.setPresupuestos).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'p2' })
      ]);
    });

    test('lanza si no existe', () => {
      storageService.getPresupuestos.mockReturnValue([{ ...base, id: 'p1' }]);
      expect(() => budgetService.deleteBudget('otro')).toThrow('Presupuesto no encontrado');
      expect(storageService.setPresupuestos).not.toHaveBeenCalled();
    });
  });
});
