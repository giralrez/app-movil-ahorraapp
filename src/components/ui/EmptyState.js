import React from 'react';

export default function EmptyState({ icono = '📭', titulo = 'Sin datos', descripcion, accion }) {
  return (
    <div className="ahorr-state">
      <span className="ahorr-state__icon" aria-hidden="true">{icono}</span>
      <h3 className="ahorr-state__title">{titulo}</h3>
      {descripcion && <p className="ahorr-state__description">{descripcion}</p>}
      {accion}
    </div>
  );
}
