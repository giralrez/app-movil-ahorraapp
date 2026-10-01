import {
  createTransaction,
  isValidTransaction,
  generarId,
  CAMPOS_OPCIONALES_TRANSACCION
} from './Transaction';

describe('generarId', () => {
  test('genera strings únicos', () => {
    const a = generarId();
    const b = generarId();
    expect(typeof a).toBe('string');
    expect(a.length).toBeGreaterThan(0);
    expect(a).not.toBe(b);
  });
});

describe('createTransaction', () => {
  const base = { tipo: 'gasto', categoria: 'Comida', monto: 50, fecha: '2026-10-01' };

  test('genera id automáticamente', () => {
    const t = createTransaction(base);
    expect(typeof t.id).toBe('string');
    expect(t.id.length).toBeGreaterThan(0);
  });

  test('conserva el id entregado', () => {
    const t = createTransaction({ ...base, id: 'abc-123' });
    expect(t.id).toBe('abc-123');
  });

  test('campos opcionales con valores por defecto', () => {
    const t = createTransaction(base);
    expect(t.metodoPago).toBe('');
    expect(t.descripcion).toBe('');
    expect(CAMPOS_OPCIONALES_TRANSACCION).toEqual(['metodoPago', 'descripcion']);
  });

  test('normaliza strings con espacios', () => {
    const t = createTransaction({
      ...base,
      categoria: '  Comida  ',
      descripcion: '  Almuerzo  ',
      metodoPago: ' Efectivo '
    });
    expect(t.categoria).toBe('Comida');
    expect(t.descripcion).toBe('Almuerzo');
    expect(t.metodoPago).toBe('Efectivo');
  });
});

describe('isValidTransaction', () => {
  test('acepta datos legacy sin metodoPago/descripcion', () => {
    expect(
      isValidTransaction({ tipo: 'ingreso', categoria: 'Salario', monto: 10, fecha: '2026-01-01' })
    ).toBe(true);
  });

  test('rechaza tipos inválidos y montos no positivos', () => {
    expect(isValidTransaction({ tipo: 'x', categoria: 'a', monto: 1, fecha: '2026-01-01' })).toBe(false);
    expect(isValidTransaction({ tipo: 'gasto', categoria: 'a', monto: 0, fecha: '2026-01-01' })).toBe(false);
  });
});
