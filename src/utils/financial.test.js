import {
  calculateIncome,
  calculateExpenses,
  calculateBalance,
  calculateSavings,
  calculateSavingsRate,
  montoNumerico
} from './financial';

const transacciones = [
  { tipo: 'ingreso', monto: 1000 },
  { tipo: 'ingreso', monto: 500 },
  { tipo: 'gasto', monto: 300 },
  { tipo: 'gasto', monto: 200 }
];

describe('financial utils', () => {
  test('calculateIncome suma solo ingresos', () => {
    expect(calculateIncome(transacciones)).toBe(1500);
  });

  test('calculateExpenses suma solo gastos', () => {
    expect(calculateExpenses(transacciones)).toBe(500);
  });

  test('calculateBalance resta gastos de ingresos', () => {
    expect(calculateBalance(transacciones)).toBe(1000);
  });

  test('calculateSavings equivale al balance', () => {
    expect(calculateSavings(transacciones)).toBe(1000);
  });

  test('calculateSavingsRate calcula porcentaje', () => {
    expect(calculateSavingsRate(transacciones)).toBeCloseTo(66.67, 2);
  });

  test('calculateSavingsRate devuelve 0 con ingresos cero', () => {
    expect(calculateSavingsRate([])).toBe(0);
  });

  test('calculateSavingsRate devuelve 0 con ingresos negativos', () => {
    expect(calculateSavingsRate([{ tipo: 'ingreso', monto: -100 }])).toBe(0);
  });

  test('maneja montos como string', () => {
    expect(calculateIncome([{ tipo: 'ingreso', monto: '1000' }])).toBe(1000);
  });

  test('montoNumerico devuelve 0 para valores invalidos', () => {
    expect(montoNumerico('abc')).toBe(0);
    expect(montoNumerico(null)).toBe(0);
    expect(montoNumerico(undefined)).toBe(0);
  });

  test('calculos ignoran transacciones invalidas', () => {
    const conNulos = [null, undefined, { tipo: 'gasto' }, ...transacciones];
    expect(calculateIncome(conNulos)).toBe(1500);
    expect(calculateExpenses(conNulos)).toBe(500);
  });

  test('conjunto vacio devuelve 0', () => {
    expect(calculateIncome([])).toBe(0);
    expect(calculateExpenses([])).toBe(0);
    expect(calculateBalance([])).toBe(0);
  });
});