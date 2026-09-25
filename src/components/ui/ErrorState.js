import React from 'react';

export default function ErrorState({
  titulo = 'Algo salió mal',
  descripcion,
  accion
}) {
  return (
    <div className="ahorr-state ahorr-state--error" role="alert">
      <span className="ahorr-state__icon" aria-hidden="true">⚠️</span>
      <h3 className="ahorr-state__title">{titulo}</h3>
      {descripcion && <p className="ahorr-state__description">{descripcion}</p>}
      {accion}
    </div>
  );
}
