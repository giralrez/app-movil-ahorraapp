import { calcularMeta, metasConProgreso } from './GoalCalculations';

const HOY = new Date(2026, 9, 15);

describe('calcularMeta', () => {
  test('calcula progreso y restante', () => {
    const r = calcularMeta({ montoObjetivo: 1000, montoActual: 250, fechaLimite: null }, HOY);
    expect(r.progreso).toBe(25);
    expect(r.restante).toBe(750);
    expect(r.completada).toBe(false);
    expect(r.estado).toBe('en curso');
    expect(r.diasRestantes).toBeNull();
  });

  test('meta completada cuando alcanza el objetivo', () => {
    const r = calcularMeta({ montoObjetivo: 1000, montoActual: 1000, fechaLimite: null }, HOY);
    expect(r.progreso).toBe(100);
    expect(r.restante).toBe(0);
    expect(r.completada).toBe(true);
    expect(r.estado).toBe('completada');
  });

  test('trata montoActual ausente como 0', () => {
    const r = calcularMeta({ montoObjetivo: 500 }, HOY);
    expect(r.progreso).toBe(0);
    expect(r.restante).toBe(500);
  });

  test('días restantes hacia una fecha futura', () => {
    const r = calcularMeta(
      { montoObjetivo: 1000, montoActual: 0, fechaLimite: '2026-10-20' },
      HOY
    );
    expect(r.diasRestantes).toBe(5);
    expect(r.estado).toBe('en curso');
  });

  test('la fecha de hoy es el último día', () => {
    const r = calcularMeta(
      { montoObjetivo: 1000, montoActual: 0, fechaLimite: '2026-10-15' },
      HOY
    );
    expect(r.diasRestantes).toBe(0);
    expect(r.estado).toBe('en curso');
  });

  test('meta vencida cuando la fecha ya pasó', () => {
    const r = calcularMeta(
      { montoObjetivo: 1000, montoActual: 0, fechaLimite: '2026-10-10' },
      HOY
    );
    expect(r.diasRestantes).toBe(-5);
    expect(r.estado).toBe('vencida');
  });

  test('una meta completada nunca queda vencida', () => {
    const r = calcularMeta(
      { montoObjetivo: 1000, montoActual: 1000, fechaLimite: '2026-10-10' },
      HOY
    );
    expect(r.estado).toBe('completada');
  });
});

describe('metasConProgreso', () => {
  test('enriquece cada meta con su cálculo', () => {
    const metas = [
      { id: 'm1', nombre: 'Viaje', montoObjetivo: 1000, montoActual: 500, fechaLimite: null },
      { id: 'm2', nombre: 'Fondo', montoObjetivo: 200, montoActual: 200, fechaLimite: null }
    ];
    const lista = metasConProgreso(metas, HOY);
    expect(lista[0]).toMatchObject({ id: 'm1', progreso: 50, estado: 'en curso' });
    expect(lista[1]).toMatchObject({ id: 'm2', progreso: 100, estado: 'completada' });
  });
});
