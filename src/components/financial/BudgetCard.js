import React from 'react';
import { Button, Card } from '../ui';
import BudgetProgress from './BudgetProgress';

const ETIQUETAS_ESTADO = {
  ok: 'En control',
  alerta: 'Cerca del límite',
  superado: 'Límite superado'
};

const ETIQUETAS_PERIODO = { mensual: 'Mensual', semanal: 'Semanal', anual: 'Anual' };

export default function BudgetCard({ presupuesto, onEditar, onEliminar }) {
  const {
    nombre,
    categoria,
    periodo,
    montoLimite,
    spent,
    remaining,
    estado
  } = presupuesto;

  return (
    <Card className={`ahorr-budget-card ahorr-budget-card--${estado}`}>
      <div className="ahorr-card__header">
        <h3 className="ahorr-card__titulo">{nombre}</h3>
        <span className={`ahorr-badge ahorr-badge--${estado}`}>
          {ETIQUETAS_ESTADO[estado] || estado}
        </span>
      </div>

      <p className="ahorr-card__meta">
        {categoria || 'Todas las categorías'} · {ETIQUETAS_PERIODO[periodo] || periodo}
      </p>

      <BudgetProgress spent={spent} remaining={remaining} montoLimite={montoLimite} />

      <div className="ahorr-item-acciones">
        <Button
          variant="ghost"
          size="small"
          aria-label={`Editar presupuesto ${nombre}`}
          onClick={() => onEditar(presupuesto)}
        >
          Editar
        </Button>
        <Button
          variant="danger"
          size="small"
          aria-label={`Eliminar presupuesto ${nombre}`}
          onClick={() => onEliminar(presupuesto)}
        >
          Eliminar
        </Button>
      </div>
    </Card>
  );
}
