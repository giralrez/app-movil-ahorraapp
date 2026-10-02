import * as storageService from './storageService';
import * as adapter from './localStorageAdapter';

jest.mock('./localStorageAdapter', () => ({
  leerUsuario: jest.fn(),
  escribirUsuario: jest.fn(),
  leerTransacciones: jest.fn(),
  escribirTransacciones: jest.fn(),
  leerPresupuestos: jest.fn(),
  escribirPresupuestos: jest.fn(),
  leerMetas: jest.fn(),
  escribirMetas: jest.fn()
}));

describe('storageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getUsuario delega en el adapter', () => {
    adapter.leerUsuario.mockReturnValue('Ana');
    expect(storageService.getUsuario()).toBe('Ana');
    expect(adapter.leerUsuario).toHaveBeenCalled();
  });

  test('setUsuario delega en el adapter', () => {
    storageService.setUsuario('Ana');
    expect(adapter.escribirUsuario).toHaveBeenCalledWith('Ana');
  });

  test('getTransacciones delega en el adapter', () => {
    const lista = [{ tipo: 'ingreso', monto: 100 }];
    adapter.leerTransacciones.mockReturnValue(lista);
    expect(storageService.getTransacciones()).toEqual(lista);
    expect(adapter.leerTransacciones).toHaveBeenCalled();
  });

  test('setTransacciones delega en el adapter', () => {
    const lista = [{ tipo: 'gasto', monto: 50 }];
    storageService.setTransacciones(lista);
    expect(adapter.escribirTransacciones).toHaveBeenCalledWith(lista);
  });

  test('getPresupuestos delega en el adapter', () => {
    const lista = [{ nombre: 'Comida', montoLimite: 400 }];
    adapter.leerPresupuestos.mockReturnValue(lista);
    expect(storageService.getPresupuestos()).toEqual(lista);
    expect(adapter.leerPresupuestos).toHaveBeenCalled();
  });

  test('setPresupuestos delega en el adapter', () => {
    const lista = [{ nombre: 'Luz', montoLimite: 80 }];
    storageService.setPresupuestos(lista);
    expect(adapter.escribirPresupuestos).toHaveBeenCalledWith(lista);
  });

  test('getMetas delega en el adapter', () => {
    const lista = [{ nombre: 'Viaje', montoObjetivo: 1000 }];
    adapter.leerMetas.mockReturnValue(lista);
    expect(storageService.getMetas()).toEqual(lista);
    expect(adapter.leerMetas).toHaveBeenCalled();
  });

  test('setMetas delega en el adapter', () => {
    const lista = [{ nombre: 'Fondo', montoObjetivo: 500 }];
    storageService.setMetas(lista);
    expect(adapter.escribirMetas).toHaveBeenCalledWith(lista);
  });
});