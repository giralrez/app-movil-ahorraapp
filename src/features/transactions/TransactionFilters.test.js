import {
  buscarTransacciones,
  filtrarTransacciones,
  ordenarTransacciones,
  aplicarFiltros
} from './TransactionFilters';

const tx = (extra = {}) => ({
  tipo: 'gasto',
  categoria: 'Comida',
  monto: 100,
  fecha: '2026-10-01',
  descripcion: '',
  metodoPago: '',
  ...extra
});

describe('buscarTransacciones', () => {
  const lista = [
    tx({ descripcion: 'Almuerzo oficina' }),
    tx({ categoria: 'Transporte', fecha: '2026-10-02' }),
    tx({ metodoPago: 'Nequi/Daviplata', fecha: '2026-10-03' })
  ];

  test('vacío devuelve todo (copia)', () => {
    const res = buscarTransacciones(lista, '  ');
    expect(res).toEqual(lista);
    expect(res).not.toBe(lista);
  });

  test('busca por categoría, descripción, método y fecha', () => {
    expect(buscarTransacciones(lista, 'transporte')).toHaveLength(1);
    expect(buscarTransacciones(lista, 'almuerzo')).toHaveLength(1);
    expect(buscarTransacciones(lista, 'nequi')).toHaveLength(1);
    expect(buscarTransacciones(lista, '2026-10-02')).toHaveLength(1);
  });

  test('sin coincidencias devuelve []', () => {
    expect(buscarTransacciones(lista, 'xyz')).toEqual([]);
  });
});

describe('filtrarTransacciones', () => {
  const lista = [
    tx({ tipo: 'ingreso', categoria: 'Salario', monto: 500, fecha: '2026-09-10' }),
    tx({ categoria: 'Comida', monto: 50, fecha: '2026-10-05' }),
    tx({ categoria: 'Transporte', monto: 30, fecha: '2026-10-20' })
  ];

  test('filtra por tipo', () => {
    expect(filtrarTransacciones(lista, { tipo: 'ingreso' })).toHaveLength(1);
  });

  test('filtra por categoría', () => {
    expect(filtrarTransacciones(lista, { categoria: 'Comida' })).toHaveLength(1);
  });

  test('filtra por rango de fechas inclusivo', () => {
    const res = filtrarTransacciones(lista, { desde: '2026-10-01', hasta: '2026-10-05' });
    expect(res).toHaveLength(1);
    expect(res[0].categoria).toBe('Comida');
  });

  test('sin filtros devuelve todo', () => {
    expect(filtrarTransacciones(lista, {})).toHaveLength(3);
  });
});

describe('ordenarTransacciones', () => {
  const lista = [
    tx({ fecha: '2026-10-01', monto: 10 }),
    tx({ fecha: '2026-10-15', monto: 300 }),
    tx({ fecha: '2026-10-07', monto: 200 })
  ];

  test('por defecto: fecha descendente', () => {
    expect(ordenarTransacciones(lista).map((t) => t.fecha)).toEqual([
      '2026-10-15',
      '2026-10-07',
      '2026-10-01'
    ]);
  });

  test('fecha ascendente', () => {
    expect(ordenarTransacciones(lista, 'fecha-asc').map((t) => t.fecha)).toEqual([
      '2026-10-01',
      '2026-10-07',
      '2026-10-15'
    ]);
  });

  test('monto descendente y ascendente', () => {
    expect(ordenarTransacciones(lista, 'monto-desc').map((t) => t.monto)).toEqual([300, 200, 10]);
    expect(ordenarTransacciones(lista, 'monto-asc').map((t) => t.monto)).toEqual([10, 200, 300]);
  });

  test('no muta la lista original', () => {
    const original = [...lista];
    ordenarTransacciones(lista, 'monto-desc');
    expect(lista).toEqual(original);
  });
});

describe('aplicarFiltros', () => {
  test('combina búsqueda, filtros y orden', () => {
    const lista = [
      tx({ categoria: 'Comida', fecha: '2026-10-01', monto: 10 }),
      tx({ categoria: 'Comida', fecha: '2026-10-10', monto: 500 }),
      tx({ categoria: 'Transporte', fecha: '2026-10-11', monto: 999 })
    ];
    const res = aplicarFiltros(lista, { texto: 'comida', categoria: 'Comida', orden: 'monto-desc' });
    expect(res.map((t) => t.monto)).toEqual([500, 10]);
  });
});
