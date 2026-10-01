import React from 'react';
import { Card, Input, Select } from '../ui';
import { TIPOS_PERIODO } from '../../features/dashboard/DashboardService';

const ETIQUETAS = {
  actual: 'Mes actual',
  anterior: 'Mes anterior',
  personalizado: 'Período personalizado'
};

export default function PeriodSelector({
  tipo = 'actual',
  personalizado = { desde: '', hasta: '' },
  onChangeTipo,
  onChangePersonalizado
}) {
  const enPersonalizado = tipo === 'personalizado';
  const faltanFechas = enPersonalizado && (!personalizado.desde || !personalizado.hasta);
  const invertido =
    enPersonalizado &&
    personalizado.desde &&
    personalizado.hasta &&
    personalizado.desde > personalizado.hasta;

  return (
    <Card className="ahorr-periodo">
      <Select
        label="Período"
        id="periodo-dashboard"
        value={ETIQUETAS[tipo] || ETIQUETAS.actual}
        options={TIPOS_PERIODO.map((t) => ETIQUETAS[t])}
        onChange={(e) => {
          const seleccionado = TIPOS_PERIODO.find((t) => ETIQUETAS[t] === e.target.value);
          onChangeTipo?.(seleccionado || 'actual');
        }}
      />

      {enPersonalizado && (
        <>
          <div className="ahorr-periodo__fechas">
            <Input
              label="Desde"
              id="periodo-desde"
              type="date"
              value={personalizado.desde}
              max={personalizado.hasta || undefined}
              onChange={(e) => onChangePersonalizado?.({ ...personalizado, desde: e.target.value })}
            />
            <Input
              label="Hasta"
              id="periodo-hasta"
              type="date"
              value={personalizado.hasta}
              min={personalizado.desde || undefined}
              error={invertido ? 'Debe ser posterior a «Desde»' : undefined}
              onChange={(e) => onChangePersonalizado?.({ ...personalizado, hasta: e.target.value })}
            />
          </div>
          {faltanFechas && !invertido && (
            <p className="ahorr-periodo__aviso">Selecciona la fecha desde y hasta para filtrar.</p>
          )}
        </>
      )}
    </Card>
  );
}
