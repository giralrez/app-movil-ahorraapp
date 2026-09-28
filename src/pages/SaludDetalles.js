import React, { useMemo } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { montoNumerico } from '../utils/financial';
import { useApp } from '../app/context/AppContext';
import { Button, Card, EmptyState, FinancialMetric, Icon, TransactionItem } from '../components/ui';

export default function SaludDetalle() {
  const location = useLocation();
  const history = useHistory();
  const { transacciones } = useApp();
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get('tipo');

  const { lista, total } = useMemo(() => {
    if (!tipo) return { lista: [], total: 0 };

    const tipoNormalizado = tipo === "ingresos" ? "ingreso" : tipo === "gastos" ? "gasto" : tipo.toLowerCase();
    const filtrados = (transacciones || []).filter((t) => t && t.tipo === tipoNormalizado);
    const totalCalculado = filtrados.reduce((acc, t) => acc + montoNumerico(t.monto), 0);

    return { lista: filtrados, total: totalCalculado };
  }, [transacciones, tipo]);

  const esIngresos = tipo === "ingresos";

  return (
    <IonPage>
      <IonContent className="ion-padding">

        <div className="btn-volver">
          <Button variant="ghost" block onClick={() => history.goBack()}>
            <Icon nombre="chevronBack" aria-hidden="true" /> Volver
          </Button>
        </div>

        <h2 className="pagina-titulo">
          Detalles de {esIngresos ? "Ingresos" : "Gastos"}
        </h2>

        <Card>
          <FinancialMetric
            label={esIngresos ? "Ingresos Totales" : "Gastos Totales"}
            value={total}
            variant={esIngresos ? "income" : "expense"}
          />
        </Card>

        <h3 className="seccion-subtitulo">
          Movimientos de {esIngresos ? "Ingresos" : "Gastos"}
        </h3>

        {lista.length === 0 ? (
          <EmptyState
            icono={esIngresos ? "receipt" : "documentText"}
            titulo="Sin movimientos"
            descripcion={`Aún no hay ${esIngresos ? "ingresos" : "gastos"} registrados.`}
          />
        ) : (
          lista.map((item, index) => (
            <TransactionItem
              key={item.id || `${item.tipo}-${item.fecha}-${item.monto}-${index}`}
              titulo={item.categoria}
              fecha={`Fecha: ${item.fecha}`}
              monto={item.monto}
              tipo={item.tipo}
            />
          ))
        )}
      </IonContent>
    </IonPage>
  );
}
