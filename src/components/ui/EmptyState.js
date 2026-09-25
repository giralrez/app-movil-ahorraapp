import React from 'react';
import Icon from './Icon';

export default function EmptyState({
  icono = 'fileTray',
  titulo = 'Sin datos',
  descripcion,
  accion
}) {
  return (
    <div className="ahorr-state">
      <Icon nombre={icono} className="ahorr-state__icon" aria-hidden="true" />
      <h3 className="ahorr-state__title">{titulo}</h3>
      {descripcion && <p className="ahorr-state__description">{descripcion}</p>}
      {accion}
    </div>
  );
}
