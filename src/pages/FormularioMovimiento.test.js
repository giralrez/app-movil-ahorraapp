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

jest.mock('../services/budgetService', () => ({
  getBudgets: jest.fn(() => []),
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
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { AppProvider } from '../app/context/AppContext';
import FormularioMovimiento from './FormularioMovimiento';
import * as storageService from '../services/storage/storageService';
import * as transactionService from '../services/transactionService';

function montar(ruta) {
  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);

  act(() => {
    createRoot(contenedor).render(
      <MemoryRouter initialEntries={[ruta]}>
        <AppProvider>
          <Switch>
            <Route exact path="/movimiento" component={FormularioMovimiento} />
            <Route
              exact
              path="/gasto"
              render={(props) => <FormularioMovimiento {...props} tipoInicial="gasto" />}
            />
            <Route
              exact
              path="/ingreso"
              render={(props) => <FormularioMovimiento {...props} tipoInicial="ingreso" />}
            />
            <Route path="*" render={() => <p>destino</p>} />
          </Switch>
        </AppProvider>
      </MemoryRouter>
    );
  });

  return contenedor;
}

function enviarFormulario(contenedor) {
  const form = contenedor.querySelector('form');
  act(() => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

function escribirMonto(contenedor, valor) {
  const input = contenedor.querySelector('#monto');
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, valor);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

describe('FormularioMovimiento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.getUsuario.mockReturnValue('');
    transactionService.getTransactions.mockReturnValue([]);
    transactionService.addTransaction.mockImplementation((datos) => ({
      ...datos,
      id: 'nuevo-id'
    }));
  });

  test('la ruta /gasto precarga el tipo Gasto', () => {
    const contenedor = montar('/gasto');
    expect(contenedor.textContent).toContain('Añadir Gasto');
    expect(contenedor.querySelector('#movimiento-tipo').value).toBe('Gasto');
  });

  test('valida monto vacío antes de enviar', () => {
    const contenedor = montar('/gasto');
    enviarFormulario(contenedor);

    expect(contenedor.textContent).toContain('Ingresa un monto válido mayor a cero');
    expect(transactionService.addTransaction).not.toHaveBeenCalled();
  });

  test('crea el movimiento con los datos del formulario', () => {
    const contenedor = montar('/gasto');
    escribirMonto(contenedor, '150');
    enviarFormulario(contenedor);

    expect(transactionService.addTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'gasto', monto: 150, categoria: 'Comida' })
    );
    expect(contenedor.textContent).toContain('destino');
  });

  test('modo edición precarga la transacción y la actualiza', () => {
    transactionService.getTransactions.mockReturnValue([
      {
        id: 't1',
        tipo: 'ingreso',
        categoria: 'Salario',
        monto: 500,
        fecha: '2026-10-01',
        metodoPago: 'Efectivo',
        descripcion: 'Nómina'
      }
    ]);

    const contenedor = montar('/movimiento?editar=t1');
    expect(contenedor.textContent).toContain('Editar movimiento');
    expect(contenedor.textContent).toContain('Guardar cambios');
    expect(contenedor.querySelector('#movimiento-tipo').value).toBe('Ingreso');
    expect(contenedor.querySelector('#monto').value).toContain('500');

    enviarFormulario(contenedor);

    expect(transactionService.updateTransaction).toHaveBeenCalledWith(
      't1',
      expect.objectContaining({ tipo: 'ingreso', monto: 500 })
    );
    expect(transactionService.addTransaction).not.toHaveBeenCalled();
  });

  test('muestra estado de no encontrado si el id no existe', () => {
    const contenedor = montar('/movimiento?editar=no-existe');
    expect(contenedor.textContent).toContain('Transacción no encontrada');
    expect(contenedor.querySelector('form')).toBeNull();
  });
});
