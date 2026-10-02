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
  getBudgets: jest.fn(),
  addBudget: jest.fn(),
  updateBudget: jest.fn(),
  deleteBudget: jest.fn()
}));

jest.mock('../services/goalService', () => ({
  getGoals: jest.fn(() => []),
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
import Presupuestos from './Presupuestos';
import * as storageService from '../services/storage/storageService';
import * as transactionService from '../services/transactionService';
import * as budgetService from '../services/budgetService';

const HOY = (() => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
})();

const PRESUPUESTOS = [
  { id: 'p1', nombre: 'Comida del mes', categoria: 'Comida', montoLimite: 100, periodo: 'mensual' },
  { id: 'p2', nombre: 'Gasto libre', categoria: null, montoLimite: 1000, periodo: 'mensual' }
];

function montar() {
  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);

  act(() => {
    createRoot(contenedor).render(
      <MemoryRouter initialEntries={['/presupuestos']}>
        <AppProvider>
          <Route exact path="/presupuestos" component={Presupuestos} />
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

describe('Presupuestos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.getUsuario.mockReturnValue('');
    transactionService.getTransactions.mockReturnValue([]);
    budgetService.getBudgets.mockReturnValue(PRESUPUESTOS);
  });

  test('lista los presupuestos y muestra el contador', () => {
    const contenedor = montar();

    expect(contenedor.textContent).toContain('2 presupuestos');
    expect(contenedor.textContent).toContain('Comida del mes');
    expect(contenedor.textContent).toContain('Gasto libre');
    expect(contenedor.textContent).toContain('Todas las categorías');
    expect(contenedor.textContent).toContain('En control');
  });

  test('muestra alerta cuando un presupuesto se acerca al límite', () => {
    transactionService.getTransactions.mockReturnValue([
      { id: 'g1', tipo: 'gasto', categoria: 'Comida', monto: 90, fecha: HOY }
    ]);

    const contenedor = montar();

    expect(contenedor.textContent).toContain('Cerca del límite');
    expect(contenedor.textContent).toContain('1 presupuesto está cerca del límite');
  });

  test('estado vacío ofrece crear el primer presupuesto', () => {
    budgetService.getBudgets.mockReturnValue([]);

    const contenedor = montar();

    expect(contenedor.textContent).toContain('0 presupuestos');
    expect(contenedor.textContent).toContain('Aún no hay presupuestos');
    expect(contenedor.textContent).toContain('Crear presupuesto');
  });

  test('valida nombre vacío antes de enviar', () => {
    budgetService.getBudgets.mockReturnValue([]);
    const contenedor = montar();

    clickear(contenedor, botonPorTexto(contenedor, 'Nuevo presupuesto'));
    enviar(contenedor);

    expect(contenedor.textContent).toContain('Ingresa un nombre para el presupuesto');
    expect(budgetService.addBudget).not.toHaveBeenCalled();
  });

  test('valida límite no positivo antes de enviar', () => {
    budgetService.getBudgets.mockReturnValue([]);
    const contenedor = montar();

    clickear(contenedor, botonPorTexto(contenedor, 'Nuevo presupuesto'));
    cambiar(contenedor, '#presupuesto-nombre', 'Comida');
    enviar(contenedor);

    expect(contenedor.textContent).toContain('Ingresa un límite mayor a cero');
    expect(budgetService.addBudget).not.toHaveBeenCalled();
  });

  test('crea el presupuesto con los datos del formulario', () => {
    budgetService.addBudget.mockReturnValue({ id: 'p3', nombre: 'Transporte' });
    const contenedor = montar();

    clickear(contenedor, botonPorTexto(contenedor, 'Nuevo presupuesto'));
    cambiar(contenedor, '#presupuesto-nombre', 'Transporte');
    cambiar(contenedor, '#presupuesto-categoria', 'Transporte');
    cambiar(contenedor, '#presupuesto-limite', '250');
    enviar(contenedor);

    expect(budgetService.addBudget).toHaveBeenCalledWith({
      nombre: 'Transporte',
      categoria: 'Transporte',
      montoLimite: 250,
      periodo: 'mensual'
    });
    expect(contenedor.textContent).toContain('Presupuesto creado.');
    expect(contenedor.querySelector('form')).toBeNull();
  });

  test('expone error del servicio en el formulario', () => {
    budgetService.addBudget.mockImplementation(() => {
      throw new Error('Presupuesto inválido');
    });
    const contenedor = montar();

    clickear(contenedor, botonPorTexto(contenedor, 'Nuevo presupuesto'));
    cambiar(contenedor, '#presupuesto-nombre', 'Comida');
    cambiar(contenedor, '#presupuesto-limite', '100');
    enviar(contenedor);

    expect(contenedor.textContent).toContain('⚠ Presupuesto inválido');
  });

  test('modo edición precarga el presupuesto y lo actualiza', () => {
    budgetService.updateBudget.mockReturnValue({ id: 'p1' });
    const contenedor = montar();

    clickear(
      contenedor,
      contenedor.querySelector('[aria-label="Editar presupuesto Comida del mes"]')
    );

    expect(contenedor.querySelector('#presupuesto-nombre').value).toBe('Comida del mes');
    expect(contenedor.querySelector('h3').textContent).toBe('Editar “Comida del mes”');

    cambiar(contenedor, '#presupuesto-limite', '150');
    enviar(contenedor);

    expect(budgetService.updateBudget).toHaveBeenCalledWith('p1', {
      nombre: 'Comida del mes',
      categoria: 'Comida',
      montoLimite: 150,
      periodo: 'mensual'
    });
    expect(contenedor.textContent).toContain('Presupuesto actualizado.');
  });

  test('cambiar de edición reinicia el formulario (regresión key)', () => {
    const contenedor = montar();

    clickear(
      contenedor,
      contenedor.querySelector('[aria-label="Editar presupuesto Comida del mes"]')
    );
    cambiar(contenedor, '#presupuesto-nombre', 'Nombre temporal');

    clickear(
      contenedor,
      contenedor.querySelector('[aria-label="Editar presupuesto Gasto libre"]')
    );

    expect(contenedor.querySelector('#presupuesto-nombre').value).toBe('Gasto libre');
    expect(contenedor.querySelector('h3').textContent).toBe('Editar “Gasto libre”');
  });

  test('expone acciones de editar y eliminar con labels accesibles', () => {
    const contenedor = montar();

    const editar = contenedor.querySelector(
      '[aria-label="Editar presupuesto Comida del mes"]'
    );
    const eliminar = contenedor.querySelector(
      '[aria-label="Eliminar presupuesto Comida del mes"]'
    );

    expect(editar).not.toBeNull();
    expect(eliminar).not.toBeNull();
    expect(contenedor.querySelectorAll('[aria-label^="Eliminar presupuesto"]')).toHaveLength(2);
  });
});
