import React from 'react';
import { Button, Card } from '../ui';
import GoalProgress from './GoalProgress';

const ETIQUETAS_ESTADO = {
  completada: 'Completada',
  'en curso': 'En curso',
  vencida: 'Vencida'
};

function detalleFecha(meta) {
  if (!meta.fechaLimite) return 'Sin fecha límite';
  if (meta.completada) return `Fecha límite: ${meta.fechaLimite}`;
  if (meta.diasRestantes === 0) return 'Hoy es el último día';
  if (meta.diasRestantes > 0) return `Quedan ${meta.diasRestantes} días`;
  return `Vencida hace ${Math.abs(meta.diasRestantes)} días`;
}

export default function SavingsGoalCard({ meta, onEditar, onEliminar, onAportar }) {
  return (
    <Card className={`ahorr-goal-card ahorr-goal-card--${meta.estado.replace(' ', '-')}`}>
      <div className="ahorr-card__header">
        <h3 className="ahorr-card__titulo">{meta.nombre}</h3>
        <span className={`ahorr-badge ahorr-badge--${meta.estado.replace(' ', '-')}`}>
          {ETIQUETAS_ESTADO[meta.estado] || meta.estado}
        </span>
      </div>

      <p className="ahorr-card__meta">{detalleFecha(meta)}</p>

      <GoalProgress
        montoActual={meta.montoActual}
        montoObjetivo={meta.montoObjetivo}
        restante={meta.restante}
      />

      <div className="ahorr-item-acciones">
        <Button
          variant="primary"
          size="small"
          aria-label={`Aportar a la meta ${meta.nombre}`}
          onClick={() => onAportar(meta)}
        >
          Aportar
        </Button>
        <Button
          variant="ghost"
          size="small"
          aria-label={`Editar meta ${meta.nombre}`}
          onClick={() => onEditar(meta)}
        >
          Editar
        </Button>
        <Button
          variant="danger"
          size="small"
          aria-label={`Eliminar meta ${meta.nombre}`}
          onClick={() => onEliminar(meta)}
        >
          Eliminar
        </Button>
      </div>
    </Card>
  );
}
