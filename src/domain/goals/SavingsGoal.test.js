import {
  createSavingsGoal,
  isValidSavingsGoal,
  esFechaLimiteValida
} from './SavingsGoal';

const base = { nombre: 'Viaje', montoObjetivo: 1000 };

describe('createSavingsGoal', () => {
  test('genera id automáticamente', () => {
    const meta = createSavingsGoal(base);
    expect(typeof meta.id).toBe('string');
    expect(meta.id.length).toBeGreaterThan(0);
  });

  test('conserva el id entregado', () => {
    const meta = createSavingsGoal({ ...base, id: 'm-1' });
    expect(meta.id).toBe('m-1');
  });

  test('asume montoActual 0 y sin fecha por defecto', () => {
    const meta = createSavingsGoal(base);
    expect(meta.montoActual).toBe(0);
    expect(meta.fechaLimite).toBeNull();
  });

  test('recorta el nombre', () => {
    const meta = createSavingsGoal({ ...base, nombre: '  Viaje  ' });
    expect(meta.nombre).toBe('Viaje');
  });
});

describe('isValidSavingsGoal', () => {
  test('acepta una meta válida', () => {
    expect(isValidSavingsGoal(createSavingsGoal(base))).toBe(true);
    expect(
      isValidSavingsGoal(createSavingsGoal({ ...base, fechaLimite: '2026-12-31' }))
    ).toBe(true);
    expect(
      isValidSavingsGoal(createSavingsGoal({ ...base, montoActual: 2500 }))
    ).toBe(true);
  });

  test('rechaza entradas que no son objetos', () => {
    expect(isValidSavingsGoal(null)).toBe(false);
    expect(isValidSavingsGoal(42)).toBe(false);
  });

  test('rechaza nombre vacío', () => {
    expect(isValidSavingsGoal(createSavingsGoal({ ...base, nombre: ' ' }))).toBe(false);
  });

  test('rechaza objetivo no positivo', () => {
    expect(isValidSavingsGoal(createSavingsGoal({ ...base, montoObjetivo: 0 }))).toBe(false);
    expect(isValidSavingsGoal(createSavingsGoal({ ...base, montoObjetivo: -5 }))).toBe(false);
  });

  test('rechaza montoActual negativo', () => {
    expect(
      isValidSavingsGoal(createSavingsGoal({ ...base, montoActual: -1 }))
    ).toBe(false);
  });

  test('rechaza fecha límite con formato inválido', () => {
    expect(
      isValidSavingsGoal(createSavingsGoal({ ...base, fechaLimite: '31/12/2026' }))
    ).toBe(false);
  });
});

describe('esFechaLimiteValida', () => {
  test('acepta null, undefined y fechas ISO', () => {
    expect(esFechaLimiteValida(null)).toBe(true);
    expect(esFechaLimiteValida(undefined)).toBe(true);
    expect(esFechaLimiteValida('2026-12-31')).toBe(true);
  });

  test('rechaza formatos que no siguen el patrón ISO', () => {
    expect(esFechaLimiteValida('diciembre')).toBe(false);
    expect(esFechaLimiteValida('31/12/2026')).toBe(false);
    expect(esFechaLimiteValida(123)).toBe(false);
  });
});
