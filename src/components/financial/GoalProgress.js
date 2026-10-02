import React from 'react';
import { ProgressBar } from '../ui';
import { formatCurrency } from '../../utils/format';

export default function GoalProgress({ montoActual = 0, montoObjetivo = 0, restante = 0 }) {
  return (
    <div className="ahorr-progress-block">
      <ProgressBar label="Progreso" value={montoActual} max={montoObjetivo} />
      <p className="ahorr-progress-block__text">
        {formatCurrency(montoActual)} de {formatCurrency(montoObjetivo)} ·{' '}
        {restante <= 0 ? 'Meta alcanzada' : `Faltan ${formatCurrency(restante)}`}
      </p>
    </div>
  );
}
