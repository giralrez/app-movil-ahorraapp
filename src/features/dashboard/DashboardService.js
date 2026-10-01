import {
  calculateBalance,
  calculateIncome,
  calculateExpenses,
  calculateSavings,
  calculateSavingsRate
} from '../../utils/financial';
import {
  rangoMesActual,
  rangoMesAnterior,
  filtrarPorRango,
  topCategorias,
  ultimasTransacciones
} from './FinancialSelectors';

export const TIPOS_PERIODO = ['actual', 'anterior', 'personalizado'];

export function construirPeriodo(tipo, personalizado = {}) {
  if (tipo === 'anterior') {
    return { tipo, etiqueta: 'Mes anterior', ...rangoMesAnterior() };
  }
  if (tipo === 'personalizado') {
    const desde = personalizado.desde || '';
    const hasta = personalizado.hasta || '';
    const completo = Boolean(desde && hasta);
    return {
      tipo,
      etiqueta: 'Período personalizado',
      desde: completo ? desde : '9999-12-31',
      hasta: completo ? hasta : '0000-01-01'
    };
  }
  return { tipo: 'actual', etiqueta: 'Mes actual', ...rangoMesActual() };
}

export function getDashboardData(transacciones, periodo) {
  const lista = Array.isArray(transacciones) ? transacciones : [];
  const delPeriodo = filtrarPorRango(lista, periodo.desde, periodo.hasta);
  const ingresos = calculateIncome(delPeriodo);
  const gastos = calculateExpenses(delPeriodo);

  return {
    saldo: calculateBalance(lista),
    etiquetaPeriodo: periodo.etiqueta,
    ingresos,
    gastos,
    ahorroNeto: calculateSavings(delPeriodo),
    tasaAhorro: calculateSavingsRate(delPeriodo),
    categorias: topCategorias(delPeriodo),
    ultimas: ultimasTransacciones(delPeriodo),
    sinTransacciones: delPeriodo.length === 0
  };
}
