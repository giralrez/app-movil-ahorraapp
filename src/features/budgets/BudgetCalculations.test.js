import {
  UMBRAL_ALERTA,
  cadenaFecha,
  inicioDePeriodo,
  gastosDelPeriodo,
  calcularPresupuesto,
  presupuestosConProgreso,
  presupuestosEnAlerta
} from './BudgetCalculations';

const HOY = new Date(2026, 9, 15);

const TRANSACCIONES = [
  { id: 'g1', tipo: 'gasto', categoria: 'Comida', monto: 50, fecha: '2026-10-05' },
  { id: 'g2', tipo: 'gasto', categoria: 'Comida', monto: 30, fecha: '2026-10-10' },
  { id: 'g3', tipo: 'gasto', categoria: 'Transporte', monto: 40, fecha: '2026-10-12' },
  { id: 'g4', tipo: 'gasto', categoria: 'Comida', monto: 999, fecha: '2026-09-30' },
  { id: 'g5', tipo: 'gasto', categoria: 'Comida', monto: 100, fecha: '2026-10-20' },
  { id: 'i1', tipo: 'ingreso', categoria: 'Salario', monto: 5000, fecha: '2026-10-02' }
];

describe('inicioDePeriodo', () => {
  test('mensual inicia el día 1 del mes', () => {
    expect(inicioDePeriodo('mensual', HOY)).toBe('2026-10-01');
  });

  test('semanal inicia el lunes de la semana (2026-10-15 es jueves)', () => {
    expect(inicioDePeriodo('semanal', HOY)).toBe('2026-10-12');
  });

  test('anual inicia el 1 de enero', () => {
    expect(inicioDePeriodo('anual', HOY)).toBe('2026-01-01');
  });

  test('acepta fechas como string', () => {
    expect(inicioDePeriodo('mensual', '2026-03-15')).toBe('2026-03-01');
  });
});

describe('cadenaFecha', () => {
  test('normaliza Date a YYYY-MM-DD local', () => {
    expect(cadenaFecha(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(cadenaFecha('2026-10-15')).toBe('2026-10-15');
  });
});

describe('gastosDelPeriodo', () => {
  test('incluye solo gastos del período calendario actual', () => {
    const gastos = gastosDelPeriodo(TRANSACCIONES, 'mensual', HOY);
    expect(gastos.map((g) => g.id)).toEqual(['g1', 'g2', 'g3']);
  });

  test('excluye ingresos, meses anteriores y fechas futuras', () => {
    const gastos = gastosDelPeriodo(TRANSACCIONES, 'mensual', HOY);
    expect(gastos.every((g) => g.tipo === 'gasto')).toBe(true);
    expect(gastos.find((g) => g.id === 'g4')).toBeUndefined();
    expect(gastos.find((g) => g.id === 'g5')).toBeUndefined();
  });

  test('la ventana semanal es de lunes a hoy', () => {
    const gastos = gastosDelPeriodo(TRANSACCIONES, 'semanal', HOY);
    expect(gastos.map((g) => g.id)).toEqual(['g3']);
  });

  test('la ventana anual cubre todo el año en curso', () => {
    const gastos = gastosDelPeriodo(TRANSACCIONES, 'anual', HOY);
    expect(gastos.map((g) => g.id)).toEqual(['g1', 'g2', 'g3', 'g4']);
  });
});

describe('calcularPresupuesto', () => {
  test('global suma todos los gastos del período', () => {
    const resultado = calcularPresupuesto(
      { categoria: null, montoLimite: 100, periodo: 'mensual' },
      TRANSACCIONES,
      HOY
    );
    expect(resultado.spent).toBe(120);
    expect(resultado.remaining).toBe(-20);
    expect(resultado.estado).toBe('superado');
  });

  test('por categoría filtra solo esa categoría', () => {
    const resultado = calcularPresupuesto(
      { categoria: 'Comida', montoLimite: 100, periodo: 'mensual' },
      TRANSACCIONES,
      HOY
    );
    expect(resultado.spent).toBe(80);
    expect(resultado.percentageUsed).toBe(80);
    expect(resultado.remaining).toBe(20);
    expect(resultado.estado).toBe('alerta');
  });

  test('estado ok por debajo del umbral', () => {
    const resultado = calcularPresupuesto(
      { categoria: 'Transporte', montoLimite: 100, periodo: 'mensual' },
      TRANSACCIONES,
      HOY
    );
    expect(resultado.spent).toBe(40);
    expect(resultado.estado).toBe('ok');
  });

  test('umbral: 80% exacto ya es alerta y 100% es superado', () => {
    expect(UMBRAL_ALERTA).toBe(80);
    const alLimite = calcularPresupuesto(
      { categoria: 'Comida', montoLimite: 100, periodo: 'mensual' },
      [{ tipo: 'gasto', categoria: 'Comida', monto: 80, fecha: '2026-10-01' }],
      HOY
    );
    expect(alLimite.estado).toBe('alerta');
    const superado = calcularPresupuesto(
      { categoria: 'Comida', montoLimite: 100, periodo: 'mensual' },
      [{ tipo: 'gasto', categoria: 'Comida', monto: 100, fecha: '2026-10-01' }],
      HOY
    );
    expect(superado.estado).toBe('superado');
  });
});

describe('presupuestosConProgreso y presupuestosEnAlerta', () => {
  const presupuestos = [
    { id: 'p1', categoria: 'Comida', montoLimite: 100, periodo: 'mensual' },
    { id: 'p2', categoria: 'Transporte', montoLimite: 100, periodo: 'mensual' },
    { id: 'p3', categoria: 'Transporte', montoLimite: 1, periodo: 'mensual' }
  ];

  test('enriquece cada presupuesto con su cálculo', () => {
    const lista = presupuestosConProgreso(presupuestos, TRANSACCIONES, HOY);
    expect(lista).toHaveLength(3);
    expect(lista[0]).toMatchObject({ id: 'p1', spent: 80, estado: 'alerta' });
    expect(lista[1]).toMatchObject({ id: 'p2', spent: 40, estado: 'ok' });
  });

  test('filtra los que están en alerta o superados', () => {
    const alertas = presupuestosEnAlerta(presupuestos, TRANSACCIONES, HOY);
    expect(alertas.map((p) => p.id)).toEqual(['p1', 'p3']);
  });
});
