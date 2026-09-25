import React from 'react';
import { formatCurrency } from '../../utils/format';

export default function FinancialMetric({ label, value, variant }) {
  return (
    <div className={`ahorr-metric ${variant ? `ahorr-metric--${variant}` : ''}`}>
      <p className="ahorr-metric__label">{label}</p>
      <p className="ahorr-metric__value">{formatCurrency(value)}</p>
    </div>
  );
}
