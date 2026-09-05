import * as storageService from './storageService';
import * as adapter from './localStorageAdapter';

jest.mock('./localStorageAdapter', () => ({
  leerUsuario: jest.fn(),
  escribirUsuario: jest.fn(),
  leerTransacciones: jest.fn(),
  escribirTransacciones: jest.fn()
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
});