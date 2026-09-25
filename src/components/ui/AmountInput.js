import React from 'react';
import { formatCurrency } from '../../utils/format';

export default function AmountInput({
  label = 'Monto',
  value,
  onChange,
  error,
  id = 'monto',
  ...props
}) {
  const esInvalido = error || (value !== '' && !Number.isFinite(Number(value)));

  return (
    <div className={`ahorr-field ${esInvalido ? 'ahorr-field--error' : ''}`}>
      <label className="ahorr-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="ahorr-field__control ahorr-amount__control"
        type="text"
        inputMode="decimal"
        placeholder="$ 0"
        value={value === '' ? '' : formatCurrency(value)}
        onChange={(evento) => {
          const limpio = evento.target.value.replace(/[^\d.-]/g, '');
          onChange(limpio);
        }}
        aria-invalid={esInvalido ? 'true' : undefined}
        aria-describedby={esInvalido ? `${id}-mensaje` : undefined}
        {...props}
      />
      {esInvalido && (
        <span id={`${id}-mensaje`} className="ahorr-field__message ahorr-field__message--error" role="alert">
          ⚠ {error || 'Ingresa un monto válido'}
        </span>
      )}
    </div>
  );
}
