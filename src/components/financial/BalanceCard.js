import React from 'react';
import { Card } from '../ui';
import { formatCurrency } from '../../utils/format';

export default function BalanceCard({ saldo = 0 }) {
  const negativo = saldo < 0;

  return (
    <Card className="ahorr-balance">
      <p className="ahorr-balance__label">Saldo actual</p>
      <p className={`ahorr-balance__value ${negativo ? 'ahorr-balance__value--negative' : ''}`}>
        {formatCurrency(saldo)}
      </p>
      <p className="ahorr-balance__caption">Ingresos acumulados − gastos acumulados</p>
    </Card>
  );
}
