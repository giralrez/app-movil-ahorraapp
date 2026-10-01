import React from 'react';
import { Card, EmptyState, TransactionItem } from '../ui';

export default function RecentTransactions({ transacciones = [] }) {
  return (
    <Card>
      <h3 className="ahorr-card__titulo">Últimas transacciones</h3>
      {transacciones.length === 0 ? (
        <EmptyState
          icono="fileTray"
          titulo="Sin movimientos en el período"
          descripcion="Añade un ingreso o un gasto para verlo aquí."
        />
      ) : (
        <div className="ahorr-ultimas">
          {transacciones.map((t, i) => (
            <TransactionItem
              key={`${t.fecha}-${t.categoria}-${i}`}
              titulo={t.categoria}
              fecha={t.fecha}
              monto={t.monto}
              tipo={t.tipo}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
