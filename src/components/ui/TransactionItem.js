import React from 'react';
import { formatCurrency } from '../../utils/format';

export default function TransactionItem({ titulo, fecha, monto, tipo }) {
  const esIngreso = tipo === 'ingreso';
  const signo = esIngreso ? '+' : '-';

  return (
    <article className="ahorr-tx-item">
      <div>
        <p className="ahorr-tx-item__title">{titulo}</p>
        {fecha && <p className="ahorr-tx-item__date">{fecha}</p>}
      </div>
      <span
        className={`ahorr-tx-item__amount ahorr-tx-item__amount--${esIngreso ? 'income' : 'expense'}`}
      >
        {signo} {formatCurrency(monto)}
      </span>
    </article>
  );
}
