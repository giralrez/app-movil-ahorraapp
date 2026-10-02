import * as adapter from './localStorageAdapter';

const transaccionesLegacy = [
  { tipo: 'ingreso', categoria: 'Salario', monto: 1000, fecha: '2024-01-15' },
  { tipo: 'gasto', categoria: 'Comida', monto: 300, fecha: '2024-01-20' }
];

describe('localStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('lee usuario vacio si no existe', () => {
    expect(adapter.leerUsuario()).toBe('');
  });

  test('escribe y lee usuario', () => {
    adapter.escribirUsuario('Ana');
    expect(adapter.leerUsuario()).toBe('Ana');
  });

  test('lee transacciones vacias si no existe', () => {
    expect(adapter.leerTransacciones()).toEqual([]);
  });

  test('persiste y lee transacciones legacy sin alterar el esquema', () => {
    adapter.escribirTransacciones(transaccionesLegacy);
    expect(adapter.leerTransacciones()).toEqual(transaccionesLegacy);
  });

  test('devuelve [] ante JSON corrupto', () => {
    localStorage.setItem('transacciones', '{"corrupto":');
    expect(adapter.leerTransacciones()).toEqual([]);
  });

  test('devuelve [] si el dato no es un array', () => {
    localStorage.setItem('transacciones', JSON.stringify({ noEsArray: true }));
    expect(adapter.leerTransacciones()).toEqual([]);
  });

  test('lee presupuestos vacios si no existe', () => {
    expect(adapter.leerPresupuestos()).toEqual([]);
  });

  test('persiste y lee presupuestos', () => {
    const lista = [{ id: 'p1', nombre: 'Comida', montoLimite: 400, periodo: 'mensual' }];
    adapter.escribirPresupuestos(lista);
    expect(adapter.leerPresupuestos()).toEqual(lista);
  });

  test('devuelve [] ante JSON corrupto en presupuestos', () => {
    localStorage.setItem('presupuestos', '{"corrupto":');
    expect(adapter.leerPresupuestos()).toEqual([]);
  });

  test('lee metas vacias si no existe', () => {
    expect(adapter.leerMetas()).toEqual([]);
  });

  test('persiste y lee metas', () => {
    const lista = [{ id: 'm1', nombre: 'Viaje', montoObjetivo: 1000, montoActual: 100 }];
    adapter.escribirMetas(lista);
    expect(adapter.leerMetas()).toEqual(lista);
  });

  test('devuelve [] ante JSON corrupto en metas', () => {
    localStorage.setItem('metas', 'no-es-json');
    expect(adapter.leerMetas()).toEqual([]);
  });
});