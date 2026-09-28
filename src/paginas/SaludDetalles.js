import React, { useEffect, useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { getTransacciones } from '../services/storage/storageService';
import { calculateIncome, calculateExpenses, montoNumerico } from '../utils/financial';
import { Button, Card, EmptyState, FinancialMetric, Icon, TransactionItem } from '../components/ui';

export default function SaludDetalle() {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get('tipo');

  const [total, setTotal] = useState(0);
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const transacciones = getTransacciones() || [];

    if (!tipo) {
      setLista([]);
      setTotal(0);
      return;
    }

    const tipoNormalizado = tipo === "ingresos" ? "ingreso" : tipo === "gastos" ? "gasto" : tipo.toLowerCase();
    const filtrados = transacciones.filter((t) => t && t.tipo === tipoNormalizado);

    setLista(filtrados);

    const totalCalculado = filtrados.reduce((acc, t) => acc + montoNumerico(t.monto), 0);
    setTotal(totalCalculado);
  }, [tipo]);

  const esIngresos = tipo === "ingresos";

  return (
    <IonPage>
      <IonContent className="ion-padding detalles-fondo">

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
