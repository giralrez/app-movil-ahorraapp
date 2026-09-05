import { formatCurrency } from './format';

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