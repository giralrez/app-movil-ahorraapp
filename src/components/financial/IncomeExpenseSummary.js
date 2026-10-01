import React from 'react';
import { Card, FinancialMetric } from '../ui';

export default function IncomeExpenseSummary({ ingresos = 0, gastos = 0 }) {
  return (
    <Card>
      <div className="ahorr-metrics-grid">
        <FinancialMetric label="Ingresos del período" value={ingresos} variant="income" />
        <FinancialMetric label="Gastos del período" value={gastos} variant="expense" />
      </div>
    </Card>
  );
}
