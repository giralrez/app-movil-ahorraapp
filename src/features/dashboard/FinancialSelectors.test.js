import {
  rangoMesActual,
  rangoMesAnterior,
  filtrarPorRango,
  topCategorias,
  ultimasTransacciones,
  tendenciaMensual
} from './FinancialSelectors';

const tx = (tipo, monto, fecha, categoria = 'Otro') => ({ tipo, monto, fecha, categoria });

describe('rangoMesActual / rangoMesAnterior', () => {
  const hoy = new Date(2026, 9, 15); // 15 oct 2026

  test('rangoMesActual cubre todo el mes en curso', () => {
    expect(rangoMesActual(hoy)).toEqual({ desde: '2026-10-01', hasta: '2026-10-31' });
  });

  test('rangoMesAnterior cubre el mes previo', () => {
    expect(rangoMesAnterior(hoy)).toEqual({ desde: '2026-09-01', hasta: '2026-09-30' });
  });

  test('cruce de año: mes anterior de enero es diciembre del año previo', () => {
    const enero = new Date(2026, 0, 10);
    expect(rangoMesAnterior(enero)).toEqual({ desde: '2025-12-01', hasta: '2025-12-31' });
  });
});

describe('filtrarPorRango', () => {
  const lista = [
    tx('gasto', 10, '2026-09-30'),
    tx('gasto', 20, '2026-10-01'),
    tx('ingreso', 30, '2026-10-15'),
    tx('gasto', 40, '2026-10-31'),
    tx('gasto', 50, '2026-11-01')
  ];

  test('incluye los extremos del rango (inclusivo)', () => {
    const res = filtrarPorRango(lista, '2026-10-01', '2026-10-31');
    expect(res).toHaveLength(3);
  });

  test('sin límites filtra todo', () => {
    expect(filtrarPorRango(lista, '', '')).toHaveLength(5);
  });

  test('entradas no array devuelven []', () => {
    expect(filtrarPorRango(null, '2026-10-01', '2026-10-31')).toEqual([]);
  });
});

describe('topCategorias', () => {
  test('agrupa gastos por categoría y ordena desc', () => {
    const lista = [
      tx('gasto', 100, '2026-10-01', 'Comida'),
      tx('gasto', 50, '2026-10-02', 'Transporte'),
      tx('gasto', 200, '2026-10-03', 'Comida'),
      tx('ingreso', 999, '2026-10-04', 'Salario')
    ];
    expect(topCategorias(lista)).toEqual([
      { categoria: 'Comida', total: 300 },
      { categoria: 'Transporte', total: 50 }
    ]);
  });

  test('respeta el límite', () => {
    const lista = ['a', 'b', 'c', 'd'].map((c) => tx('gasto', 10, '2026-10-01', c));
    expect(topCategorias(lista, 2)).toHaveLength(2);
  });

  test('lista vacía devuelve []', () => {
    expect(topCategorias([])).toEqual([]);
  });
});

describe('ultimasTransacciones', () => {
  test('ordena por fecha descendente y limita', () => {
    const lista = [
      tx('gasto', 10, '2026-10-01'),
      tx('ingreso', 20, '2026-10-15'),
      tx('gasto', 30, '2026-10-07')
    ];
    const res = ultimasTransacciones(lista, 2);
    expect(res.map((t) => t.fecha)).toEqual(['2026-10-15', '2026-10-07']);
  });
});

describe('tendenciaMensual', () => {
  test('devuelve N meses hasta el actual con totales', () => {
    const lista = [
      tx('ingreso', 1000, '2026-10-05'),
      tx('gasto', 400, '2026-10-10'),
      tx('gasto', 100, '2026-09-20')
    ];
    const res = tendenciaMensual(lista, 3);

    expect(res).toHaveLength(3);
    const actual = res[2];
    expect(actual.etiqueta).toBe('oct');
    expect(actual.ingresos).toBe(1000);
    expect(actual.gastos).toBe(400);
    const anterior = res[1];
    expect(anterior.etiqueta).toBe('sep');
    expect(anterior.gastos).toBe(100);
  });
});
