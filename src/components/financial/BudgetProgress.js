import React from 'react';
import { ProgressBar } from '../ui';
import { formatCurrency } from '../../utils/format';

export default function BudgetProgress({ spent = 0, remaining = 0, montoLimite = 0 }) {
  const excedido = remaining < 0;

  return (
    <div className="ahorr-progress-block">
      <ProgressBar label="Gastado" value={spent} max={montoLimite} inverted />
      <p className="ahorr-progress-block__text">
        {formatCurrency(spent)} de {formatCurrency(montoLimite)} ·{' '}
        {excedido
          ? `Excedido en ${formatCurrency(Math.abs(remaining))}`
          : `Restan ${formatCurrency(remaining)}`}
      </p>
    </div>
  );
}
