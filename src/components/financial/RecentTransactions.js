import React from 'react';
import { Button, Card, EmptyState, TransactionItem } from '../ui';

export default function RecentTransactions({ transacciones = [], onVerHistorial }) {
  return (
    <Card>
      <div className="ahorr-card__header">
        <h3 className="ahorr-card__titulo">Últimas transacciones</h3>
        {onVerHistorial && (
          <Button variant="ghost" size="small" onClick={onVerHistorial}>
            Ver historial
          </Button>
        )}
      </div>
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
