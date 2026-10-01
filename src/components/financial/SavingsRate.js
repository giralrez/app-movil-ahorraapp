import React from 'react';
import { Card, FinancialMetric } from '../ui';

export default function SavingsRate({ ahorroNeto = 0, tasaAhorro = 0 }) {
  const redondeada = Math.round(tasaAhorro);
  const negativa = redondeada < 0;

  return (
    <Card>
      <FinancialMetric
        label="Ahorro neto"
        value={ahorroNeto}
        variant={ahorroNeto >= 0 ? 'income' : 'expense'}
      />
      <p
        className={`ahorr-savings-rate__value ${
          negativa ? 'ahorr-savings-rate__value--negative' : ''
        }`}
      >
        Tasa de ahorro: {redondeada}%
      </p>
    </Card>
  );
}
