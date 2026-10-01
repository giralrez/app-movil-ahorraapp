import React, { useMemo } from 'react';
import { Card, EmptyState } from '../ui';
import CategoryDoughnutChart from '../charts/CategoryDoughnutChart';
import { COLORES_CATEGORIAS } from '../../theme/paleta';

function CategoryChart({ categorias = [] }) {
  const etiquetas = useMemo(() => categorias.map((c) => c.categoria), [categorias]);
  const valores = useMemo(() => categorias.map((c) => c.total), [categorias]);

  return (
    <Card>
      <h3 className="ahorr-card__titulo">Principales categorías (gastos)</h3>
      {categorias.length === 0 ? (
        <EmptyState
          icono="receipt"
          titulo="Sin gastos en el período"
          descripcion="Registra gastos para ver la distribución por categoría."
        />
      ) : (
        <div
          className="ahorr-chart"
          role="img"
          aria-label={`Gráfico de dona de gastos por categoría: ${etiquetas.join(', ')}`}
        >
          <CategoryDoughnutChart
            etiquetas={etiquetas}
            valores={valores}
            colores={COLORES_CATEGORIAS}
          />
        </div>
      )}
    </Card>
  );
}

export default React.memo(CategoryChart);
