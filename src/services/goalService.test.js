import * as goalService from './goalService';
import * as storageService from './storage/storageService';

jest.mock('./storage/storageService', () => ({
  getMetas: jest.fn(),
  setMetas: jest.fn()
}));

const base = { nombre: 'Viaje', montoObjetivo: 1000 };

describe('goalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGoals + migración de ids', () => {
    test('asigna ids a datos legacy y persiste la migración', () => {
      const legacy = [{ nombre: 'Fondo', montoObjetivo: 500, montoActual: 0, id: null }];
      storageService.getMetas.mockReturnValue(legacy);

      const resultado = goalService.getGoals();

      expect(resultado[0].id).toEqual(expect.any(String));
      expect(storageService.setMetas).toHaveBeenCalledWith(resultado);
    });

    test('no persiste cuando todos tienen id', () => {
      const lista = [{ ...base, id: 'm1' }];
      storageService.getMetas.mockReturnValue(lista);

      expect(goalService.getGoals()).toEqual(lista);
      expect(storageService.setMetas).not.toHaveBeenCalled();
    });
  });

  describe('addGoal / updateGoal / deleteGoal', () => {
    test('addGoal valida, genera id y persiste', () => {
      storageService.getMetas.mockReturnValue([]);

      const resultado = goalService.addGoal(base);

      expect(resultado).toMatchObject({ ...base, montoActual: 0, fechaLimite: null });
      expect(resultado.id).toEqual(expect.any(String));
      expect(storageService.setMetas).toHaveBeenCalledWith([
        expect.objectContaining({ ...base, id: resultado.id })
      ]);
    });

    test('addGoal rechaza objetivo no positivo', () => {
      expect(() =>
        goalService.addGoal({ ...base, montoObjetivo: 0 })
      ).toThrow('Meta inválida');
      expect(storageService.setMetas).not.toHaveBeenCalled();
    });

    test('updateGoal actualiza solo la meta indicada', () => {
      storageService.getMetas.mockReturnValue([
        { ...base, id: 'm1' },
        { ...base, nombre: 'Fondo', id: 'm2' }
      ]);

      const resultado = goalService.updateGoal('m1', { montoObjetivo: 2000 });

      expect(resultado.montoObjetivo).toBe(2000);
      expect(storageService.setMetas).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'm1', montoObjetivo: 2000 }),
        expect.objectContaining({ id: 'm2', montoObjetivo: 1000 })
      ]);
    });

    test('updateGoal lanza si no existe', () => {
      storageService.getMetas.mockReturnValue([]);
      expect(() => goalService.updateGoal('x', base)).toThrow('Meta no encontrada');
    });

    test('deleteGoal elimina la meta indicada', () => {
      storageService.getMetas.mockReturnValue([
        { ...base, id: 'm1' },
        { ...base, nombre: 'Fondo', id: 'm2' }
      ]);

      goalService.deleteGoal('m1');

      expect(storageService.setMetas).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'm2' })
      ]);
    });

    test('deleteGoal lanza si no existe', () => {
      storageService.getMetas.mockReturnValue([{ ...base, id: 'm1' }]);
      expect(() => goalService.deleteGoal('otro')).toThrow('Meta no encontrada');
    });
  });

  describe('aportes', () => {
    test('contributeToGoal suma al montoActual', () => {
      storageService.getMetas.mockReturnValue([
        { ...base, montoActual: 100, id: 'm1' }
      ]);

      const resultado = goalService.contributeToGoal('m1', 50);

      expect(resultado.montoActual).toBe(150);
      expect(storageService.setMetas).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'm1', montoActual: 150 })
      ]);
    });

    test('withdrawFromGoal resta del saldo disponible', () => {
      storageService.getMetas.mockReturnValue([
        { ...base, montoActual: 30, id: 'm1' }
      ]);

      const resultado = goalService.withdrawFromGoal('m1', 20);

      expect(resultado.montoActual).toBe(10);
    });

    test('withdrawFromGoal lanza si el retiro excede el saldo', () => {
      storageService.getMetas.mockReturnValue([
        { ...base, montoActual: 30, id: 'm1' }
      ]);

      expect(() => goalService.withdrawFromGoal('m1', 50)).toThrow('Saldo insuficiente');
      expect(storageService.setMetas).not.toHaveBeenCalled();
    });

    test('rechaza montos no positivos', () => {
      expect(() => goalService.contributeToGoal('m1', 0)).toThrow('Monto inválido');
      expect(() => goalService.withdrawFromGoal('m1', -10)).toThrow('Monto inválido');
      expect(storageService.setMetas).not.toHaveBeenCalled();
    });

    test('lanza si la meta no existe', () => {
      storageService.getMetas.mockReturnValue([]);
      expect(() => goalService.contributeToGoal('x', 10)).toThrow('Meta no encontrada');
    });
  });
});
