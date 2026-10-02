import { createBudget, isValidBudget, PERIODOS_PRESUPUESTO } from './Budget';

const base = { nombre: 'Comida del mes', montoLimite: 400, periodo: 'mensual' };

describe('createBudget', () => {
  test('genera id automáticamente', () => {
    const b = createBudget(base);
    expect(typeof b.id).toBe('string');
    expect(b.id.length).toBeGreaterThan(0);
  });

  test('conserva el id entregado', () => {
    const b = createBudget({ ...base, id: 'b-1' });
    expect(b.id).toBe('b-1');
  });

  test('recorta el nombre y asume categoría global por defecto', () => {
    const b = createBudget({ ...base, nombre: '  Viaje  ' });
    expect(b.nombre).toBe('Viaje');
    expect(b.categoria).toBeNull();
  });

  test('conserva la categoría entregada', () => {
    const b = createBudget({ ...base, categoria: 'Comida' });
    expect(b.categoria).toBe('Comida');
  });
});

describe('isValidBudget', () => {
  test('acepta un presupuesto válido', () => {
    expect(isValidBudget(createBudget(base))).toBe(true);
    expect(isValidBudget(createBudget({ ...base, categoria: 'Comida' }))).toBe(true);
  });

  test('expone los períodos soportados', () => {
    expect(PERIODOS_PRESUPUESTO).toEqual(['mensual', 'semanal', 'anual']);
  });

  test('rechaza entradas que no son objetos', () => {
    expect(isValidBudget(null)).toBe(false);
    expect(isValidBudget('presupuesto')).toBe(false);
    expect(isValidBudget(undefined)).toBe(false);
  });

  test('rechaza nombre vacío', () => {
    expect(isValidBudget(createBudget({ ...base, nombre: '   ' }))).toBe(false);
  });

  test('rechaza límite no positivo', () => {
    expect(isValidBudget(createBudget({ ...base, montoLimite: 0 }))).toBe(false);
    expect(isValidBudget(createBudget({ ...base, montoLimite: -10 }))).toBe(false);
    expect(isValidBudget(createBudget({ ...base, montoLimite: NaN }))).toBe(false);
  });

  test('rechaza período desconocido', () => {
    expect(isValidBudget(createBudget({ ...base, periodo: 'diario' }))).toBe(false);
  });

  test('rechaza categoría vacía', () => {
    expect(isValidBudget(createBudget({ ...base, categoria: '  ' }))).toBe(false);
  });
});
