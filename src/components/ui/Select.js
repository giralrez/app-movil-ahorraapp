import React from 'react';

export default function Select({
  label,
  options = [],
  error,
  success,
  placeholder,
  id,
  ...props
}) {
  const estado = error ? 'error' : success ? 'success' : '';
  const mensaje = error || success;
  const idCampo = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`ahorr-field ${estado ? `ahorr-field--${estado}` : ''}`}>
      {label && (
        <label className="ahorr-field__label" htmlFor={idCampo}>
          {label}
        </label>
      )}
      <select
        id={idCampo}
        className="ahorr-field__control"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={mensaje ? `${idCampo}-mensaje` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      {mensaje && (
        <span id={`${idCampo}-mensaje`} className={`ahorr-field__message ahorr-field__message--${estado}`} role={error ? 'alert' : undefined}>
          {error ? `⚠ ${error}` : success}
        </span>
      )}
    </div>
  );
}
