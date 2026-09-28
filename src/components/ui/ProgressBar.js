import React from 'react';

export default function ProgressBar({ label, value = 0, max = 100 }) {
  const porcentaje = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const estado = porcentaje >= 100 ? 'danger' : porcentaje >= 80 ? 'success' : '';

  return (
    <div
      className="ahorr-progress"
      role="progressbar"
      aria-valuenow={Math.round(porcentaje)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="ahorr-progress__header">
        <span>{label}</span>
        <span>{Math.round(porcentaje)}%</span>
      </div>
      <div className="ahorr-progress__track">
        <div
          className={`ahorr-progress__fill ${estado ? `ahorr-progress__fill--${estado}` : ''}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
}
