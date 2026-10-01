import { construirPeriodo, getDashboardData, TIPOS_PERIODO } from './DashboardService';

const tx = (tipo, monto, fecha, categoria = 'Otro') => ({ tipo, monto, fecha, categoria });

describe('construirPeriodo', () => {
  test('tipo actual usa el mes en curso', () => {
    const p = construirPeriodo('actual');
    expect(p.tipo).toBe('actual');
    expect(p.etiqueta).toBe('Mes actual');
    expect(p.desde).toMatch(/^\d{4}-\d{2}-01$/);
  });

  test('tipo anterior usa el mes previo', () => {
    const p = construirPeriodo('anterior');
    expect(p.etiqueta).toBe('Mes anterior');
    expect(p.hasta).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(p.desde < p.hasta).toBe(true);
  });

  test('tipo personalizado respeta fechas entregadas', () => {
    const p = construirPeriodo('personalizado', { desde: '2026-01-01', hasta: '2026-03-31' });
    expect(p).toEqual({
      tipo: 'personalizado',
      etiqueta: 'Período personalizado',
      desde: '2026-01-01',
      hasta: '2026-03-31'
    });
  });

  test('tipo personalizado sin fechas incompletas deja el rango vacío', () => {
    const p = construirPeriodo('personalizado', { desde: '2026-01-01', hasta: '' });
    expect(p.desde > p.hasta).toBe(true);
    const datos = getDashboardData([{ tipo: 'gasto', monto: 10, fecha: '2026-01-05' }], p);
    expect(datos.sinTransacciones).toBe(true);
  });

  test('sin parámetros cae en actual', () => {
    expect(construirPeriodo().tipo).toBe('actual');
    expect(TIPOS_PERIODO).toContain('personalizado');
  });
});

describe('getDashboardData', () => {
  const hoy = new Date();
  const mesActual = construirPeriodo('actual');

  test('saldo es acumulado global (no del período)', () => {
    const lista = [
      tx('ingreso', 500, '2020-01-15'),
      tx('gasto', 200, '2020-01-20'),
      tx('gasto', 50, '1999-06-01')
    ];
    const datos = getDashboardData(lista, mesActual);
    expect(datos.saldo).toBe(250);
  });

  test('métricas del período solo consideran fechas dentro del rango', () => {
    const inicio = mesActual.desde;
    const lista = [
      tx('ingreso', 1000, inicio, 'Salario'),
      tx('gasto', 300, inicio, 'Comida'),
      tx('gasto', 9999, '1999-01-01', 'Comida')
    ];
    const datos = getDashboardData(lista, mesActual);

    expect(datos.ingresos).toBe(1000);
    expect(datos.gastos).toBe(300);
    expect(datos.ahorroNeto).toBe(700);
    expect(datos.tasaAhorro).toBeCloseTo(70);
    expect(datos.sinTransacciones).toBe(false);
  });

  test('tasa de ahorro 0 cuando no hay ingresos en el período', () => {
    const datos = getDashboardData([tx('gasto', 100, mesActual.desde)], mesActual);
    expect(datos.ingresos).toBe(0);
    expect(datos.tasaAhorro).toBe(0);
    expect(datos.ahorroNeto).toBe(-100);
  });

  test('estado vacío cuando el período no tiene transacciones', () => {
    const datos = getDashboardData([], mesActual);
    expect(datos.sinTransacciones).toBe(true);
    expect(datos.categorias).toEqual([]);
    expect(datos.ultimas).toEqual([]);
  });

  test('entrada no array no rompe', () => {
    const datos = getDashboardData(undefined, mesActual);
    expect(datos.saldo).toBe(0);
    expect(datos.sinTransacciones).toBe(true);
  });
});
