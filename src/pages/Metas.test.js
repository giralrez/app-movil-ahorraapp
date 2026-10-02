globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('../services/storage/storageService', () => ({
  getUsuario: jest.fn(),
  setUsuario: jest.fn(),
  getTransacciones: jest.fn(),
  setTransacciones: jest.fn()
}));

jest.mock('../services/transactionService', () => ({
  getTransactions: jest.fn(() => []),
  addTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn()
}));

jest.mock('../services/budgetService', () => ({
  getBudgets: jest.fn(() => []),
  addBudget: jest.fn(),
  updateBudget: jest.fn(),
  deleteBudget: jest.fn()
}));

jest.mock('../services/goalService', () => ({
  getGoals: jest.fn(),
  addGoal: jest.fn(),
  updateGoal: jest.fn(),
  deleteGoal: jest.fn(),
  contributeToGoal: jest.fn(),
  withdrawFromGoal: jest.fn()
}));

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route } from 'react-router-dom';
import { AppProvider } from '../app/context/AppContext';
import Metas from './Metas';
import * as storageService from '../services/storage/storageService';
import * as goalService from '../services/goalService';

const METAS = [
  {
    id: 'm1',
    nombre: 'Viaje de fin de año',
    montoObjetivo: 1000,
    montoActual: 250,
    fechaLimite: null
  }
];

function montar() {
  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);

  act(() => {
    createRoot(contenedor).render(
      <MemoryRouter initialEntries={['/metas']}>
        <AppProvider>
          <Route exact path="/metas" component={Metas} />
        </AppProvider>
      </MemoryRouter>
    );
  });

  return contenedor;
}

function cambiar(contenedor, selector, valor) {
  const campo = contenedor.querySelector(selector);
  act(() => {
    if (campo.tagName === 'SELECT') {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
      setter.call(campo, valor);
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(campo, valor);
      campo.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

function enviar(contenedor) {
  const form = contenedor.querySelector('form');
  act(() => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

function clickear(contenedor, elemento) {
  act(() => {
    elemento.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

function botonPorTexto(contenedor, texto) {
  return [...contenedor.querySelectorAll('ion-button')].find((b) =>
    b.textContent.includes(texto)
  );
}

describe('Metas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.getUsuario.mockReturnValue('');
    goalService.getGoals.mockReturnValue(METAS);
  });

  test('lista las metas con progreso y contador', () => {
    const contenedor = montar();

    expect(contenedor.textContent).toContain('1 meta');
    expect(contenedor.textContent).toContain('Viaje de fin de año');
    expect(contenedor.textContent).toContain('25%');
    expect(contenedor.textContent).toContain('En curso');
  });

  test('estado vacío ofrece crear la primera meta', () => {
    goalService.getGoals.mockReturnValue([]);

    const contenedor = montar();

    expect(contenedor.textContent).toContain('0 metas');
    expect(contenedor.textContent).toContain('Aún no hay metas');
    expect(contenedor.textContent).toContain('Crear meta');
  });

  test('valida nombre y objetivo antes de enviar', () => {
    goalService.getGoals.mockReturnValue([]);
    const contenedor = montar();

    clickear(contenedor, botonPorTexto(contenedor, 'Nueva meta'));
    enviar(contenedor);

    expect(contenedor.textContent).toContain('Ingresa un nombre para la meta');
    expect(goalService.addGoal).not.toHaveBeenCalled();

    cambiar(contenedor, '#meta-nombre', 'Fondo de emergencia');
    enviar(contenedor);

    expect(contenedor.textContent).toContain('Ingresa un objetivo mayor a cero');
    expect(goalService.addGoal).not.toHaveBeenCalled();
  });

  test('crea la meta con los datos del formulario', () => {
    goalService.addGoal.mockReturnValue({ id: 'm2', nombre: 'Fondo' });
    const contenedor = montar();

    clickear(contenedor, botonPorTexto(contenedor, 'Nueva meta'));
    cambiar(contenedor, '#meta-nombre', 'Fondo de emergencia');
    cambiar(contenedor, '#meta-objetivo', '5000');
    cambiar(contenedor, '#meta-fecha', '2027-06-30');
    enviar(contenedor);

    expect(goalService.addGoal).toHaveBeenCalledWith({
      nombre: 'Fondo de emergencia',
      montoObjetivo: 5000,
      fechaLimite: '2027-06-30'
    });
    expect(contenedor.textContent).toContain('Meta creada.');
    expect(contenedor.querySelector('form')).toBeNull();
  });

  test('abre el formulario de aportes y registra un aporte', () => {
    goalService.contributeToGoal.mockReturnValue({ id: 'm1', montoActual: 350 });
    const contenedor = montar();

    clickear(contenedor, contenedor.querySelector('[aria-label="Aportar a la meta Viaje de fin de año"]'));

    expect(contenedor.textContent).toContain('Aportar a “Viaje de fin de año”');

    cambiar(contenedor, '#aporte-monto', '100');
    enviar(contenedor);

    expect(goalService.contributeToGoal).toHaveBeenCalledWith('m1', 100);
    expect(contenedor.textContent).toContain('Aporte registrado.');
  });

  test('registra un retiro desde el formulario de aportes', () => {
    goalService.withdrawFromGoal.mockReturnValue({ id: 'm1', montoActual: 150 });
    const contenedor = montar();

    clickear(contenedor, contenedor.querySelector('[aria-label="Aportar a la meta Viaje de fin de año"]'));
    cambiar(contenedor, '#aporte-monto', '100');

    const retirar = [...contenedor.querySelectorAll('ion-button')].find(
      (b) => b.textContent.trim() === 'Retirar'
    );
    clickear(contenedor, retirar);

    expect(goalService.withdrawFromGoal).toHaveBeenCalledWith('m1', 100);
    expect(contenedor.textContent).toContain('Retiro registrado.');
  });

  test('modo edición precarga la meta y la actualiza', () => {
    goalService.updateGoal.mockReturnValue({ id: 'm1' });
    const contenedor = montar();

    clickear(contenedor, contenedor.querySelector('[aria-label="Editar meta Viaje de fin de año"]'));

    expect(contenedor.querySelector('#meta-nombre').value).toBe('Viaje de fin de año');
    expect(contenedor.querySelector('#meta-objetivo').value).toContain('1.000');

    cambiar(contenedor, '#meta-objetivo', '2000');
    enviar(contenedor);

    expect(goalService.updateGoal).toHaveBeenCalledWith('m1', {
      nombre: 'Viaje de fin de año',
      montoObjetivo: 2000,
      fechaLimite: null
    });
    expect(contenedor.textContent).toContain('Meta actualizada.');
  });

  test('expone acciones de editar, aportar y eliminar con labels accesibles', () => {
    const contenedor = montar();

    expect(
      contenedor.querySelector('[aria-label="Aportar a la meta Viaje de fin de año"]')
    ).not.toBeNull();
    expect(
      contenedor.querySelector('[aria-label="Editar meta Viaje de fin de año"]')
    ).not.toBeNull();
    expect(
      contenedor.querySelector('[aria-label="Eliminar meta Viaje de fin de año"]')
    ).not.toBeNull();
  });
});
