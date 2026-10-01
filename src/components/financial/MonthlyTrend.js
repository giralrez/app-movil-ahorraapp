import React, { useMemo } from 'react';
import { Card, EmptyState } from '../ui';
import BarChart from '../charts/BarChart';
import { COLOR_INGRESO, COLOR_GASTO } from '../../theme/paleta';

function MonthlyTrend({ tendencia = [] }) {
  const conDatos = useMemo(
    () => tendencia.some((m) => m.ingresos > 0 || m.gastos > 0),
    [tendencia]
  );
  const labels = useMemo(() => tendencia.map((m) => m.etiqueta), [tendencia]);
  const series = useMemo(
    () => [
      { etiqueta: 'Ingresos', datos: tendencia.map((m) => m.ingresos), color: COLOR_INGRESO },
      { etiqueta: 'Gastos', datos: tendencia.map((m) => m.gastos), color: COLOR_GASTO }
    ],
    [tendencia]
  );

  return (
    <Card>
      <h3 className="ahorr-card__titulo">Tendencia mensual (6 meses)</h3>
      {!conDatos ? (
        <EmptyState
          icono="documentText"
          titulo="Aún sin historial"
          descripcion="La tendencia aparecerá cuando registres movimientos."
        />
      ) : (
        <div
          className="ahorr-chart"
          role="img"
          aria-label="Gráfico de barras de ingresos y gastos de los últimos 6 meses"
        >
          <BarChart labels={labels} series={series} />
        </div>
      )}
    </Card>
  );
}

export default React.memo(MonthlyTrend);
