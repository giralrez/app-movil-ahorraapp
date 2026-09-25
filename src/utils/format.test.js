import { formatCurrency, formatAmount } from './format';

describe('formatCurrency', () => {
  test('formatea montos en COP', () => {
    expect(formatCurrency(1000000)).toMatch(/1\.000\.000/);
  });

  test('formatea montos decimales', () => {
    expect(formatCurrency(1234.5)).toMatch(/1\.235/);
  });

  test('devuelve $0 para valores invalidos', () => {
    expect(formatCurrency('abc')).toBe('$ 0');
    expect(formatCurrency(null)).toBe('$ 0');
    expect(formatCurrency(undefined)).toBe('$ 0');
  });

  test('formatea cero', () => {
    expect(formatCurrency(0)).toMatch(/0/);
  });
});

describe('formatAmount', () => {
  test('conserva decimales al formatear', () => {
    expect(formatAmount(1234.5)).toMatch(/1\.234[,.]5/);
  });

  test('agrupa miles', () => {
    expect(formatAmount(1000000)).toMatch(/1\.000\.000/);
  });

  test('devuelve vacio para valores invalidos', () => {
    expect(formatAmount('')).toBe('');
    expect(formatAmount(null)).toBe('');
    expect(formatAmount('abc')).toBe('');
  });
});