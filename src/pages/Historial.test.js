globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('../services/storage/storageService', () => ({
  getUsuario: jest.fn(),
  setUsuario: jest.fn(),
  getTransacciones: jest.fn(),
  setTransacciones: jest.fn()
}));

jest.mock('../services/transactionService', () => ({
  getTransactions: jest.fn(),
  addTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn()
}));

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route } from 'react-router-dom';
import { AppProvider } from '../app/context/AppContext';
import Historial from './Historial';
import * as storageService from '../services/storage/storageService';
import * as transactionService from '../services/transactionService';

const TRANSACCIONES = [
  {
    id: 't1',
    tipo: 'gasto',
    categoria: 'Comida',
    monto: 50,
    fecha: '2026-10-01',
    metodoPago: 'Efectivo',
    descripcion: 'Almuerzo'
  },
  {
    id: 't2',
    tipo: 'ingreso',
    categoria: 'Salario',
    monto: 500,
    fecha: '2026-10-02',
    metodoPago: '',
    descripcion: ''
  }
];

function montar() {
  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);

  act(() => {
    createRoot(contenedor).render(
      <MemoryRouter initialEntries={['/historial']}>
        <AppProvider>
          <Route exact path="/historial" component={Historial} />
        </AppProvider>
      </MemoryRouter>
    );
  });

  return contenedor;
}

function cambiar(contenedor, selector, valor) {
  const campo = contenedor.querySelector(selector);
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    if (campo.tagName === 'SELECT') {
      setter.call(campo, valor);
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      const setterInput = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setterInput.call(campo, valor);
      campo.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

describe('Historial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.getUsuario.mockReturnValue('');
    transactionService.getTransactions.mockReturnValue(TRANSACCIONES);
    transactionService.deleteTransaction.mockReturnValue(undefined);
  });

  test('lista los movimientos y muestra el contador', () => {
    const contenedor = montar();

    expect(contenedor.textContent).toContain('2 movimientos');
    expect(contenedor.textContent).toContain('Comida');
    expect(contenedor.textContent).toContain('Salario');
    expect(contenedor.textContent).toContain('Almuerzo');
  });

  test('filtra por tipo', () => {
    const contenedor = montar();
    cambiar(contenedor, '#historial-tipo', 'Ingreso');

    expect(contenedor.textContent).toContain('1 movimiento');
    expect(contenedor.textContent).toContain('Salario');
    expect(contenedor.textContent).not.toContain('Almuerzo');
    expect(contenedor.querySelectorAll('[aria-label^="Editar"]')).toHaveLength(1);
  });

  test('búsqueda sin coincidencias ofrece limpiar filtros', () => {
    const contenedor = montar();
    cambiar(contenedor, '#historial-buscar', 'zzz-no-existe');

    expect(contenedor.textContent).toContain('Sin coincidencias');
    expect(contenedor.textContent).toContain('Limpiar filtros');

    const boton = [...contenedor.querySelectorAll('ion-button')].find(
      (b) => b.textContent.trim() === 'Limpiar filtros'
    );
    act(() => {
      boton.click();
    });

    expect(contenedor.textContent).toContain('2 movimientos');
  });

  test('expone acciones de editar y eliminar con labels accesibles', () => {
    const contenedor = montar();

    const editar = contenedor.querySelector('[aria-label^="Editar"]');
    const eliminar = contenedor.querySelector('[aria-label^="Eliminar"]');

    expect(editar).not.toBeNull();
    expect(eliminar).not.toBeNull();
    expect(editar.getAttribute('aria-label')).toContain('Editar');
    expect(eliminar.getAttribute('aria-label')).toContain('Eliminar');
    expect(eliminar.getAttribute('aria-label')).toMatch(/2026-10-0\d/);
  });
});
