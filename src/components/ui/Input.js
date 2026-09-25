import React from 'react';

export default function Input({
  label,
  error,
  success,
  id,
  ...props
}) {
  const estado = error ? 'error' : success ? 'success' : '';
  const mensaje = error || success;
  const idCampo = id || `campo-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`ahorr-field ${estado ? `ahorr-field--${estado}` : ''}`}>
      {label && (
        <label className="ahorr-field__label" htmlFor={idCampo}>
          {label}
        </label>
      )}
      <input
        id={idCampo}
        className="ahorr-field__control"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={mensaje ? `${idCampo}-mensaje` : undefined}
        {...props}
      />
      {mensaje && (
        <span id={`${idCampo}-mensaje`} className={`ahorr-field__message ahorr-field__message--${estado}`} role={error ? 'alert' : undefined}>
          {error ? `⚠ ${error}` : success}
        </span>
      )}
    </div>
  );
}
