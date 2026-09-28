import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/react";

import { useTransactions } from "../hooks/useTransactions";
import { calculateIncome, calculateExpenses } from "../utils/financial";
import { COLOR_INGRESO, COLOR_GASTO } from "../theme/paleta";
import DoughnutChart from "../components/charts/DoughnutChart";
import { Button, Card, EmptyState, FinancialMetric, Icon } from "../components/ui";
import { useHistory } from "react-router-dom";

export default function SaludFinanciera() {
  const history = useHistory();
  const [vista, setVista] = useState("ingresos");
  const transacciones = useTransactions();

  const ingresosTotal = calculateIncome(transacciones);
  const gastosTotal = calculateExpenses(transacciones);

  const valor = vista === "ingresos" ? ingresosTotal : gastosTotal;
  const color = vista === "ingresos" ? COLOR_INGRESO : COLOR_GASTO;
  const label = vista === "ingresos" ? "Ingresos" : "Gastos";
  const sinDatos = transacciones.length === 0;

  const cambiarVista = () => {
    setVista(vista === "ingresos" ? "gastos" : "ingresos");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="salud-titulo">Mi Salud Financiera</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding salud-fondo">

        <div className="btn-volver">
          <Button variant="ghost" block onClick={() => history.push('/principal')}>
            <Icon nombre="chevronBack" aria-hidden="true" /> Volver
          </Button>
        </div>

        <div className="contenedor-vista">
          <button className="flecha-cambio" onClick={cambiarVista} aria-label="Ver gastos" disabled={sinDatos}>
            <Icon nombre="chevronBack" aria-hidden="true" />
          </button>

          <Card>
            <FinancialMetric
              label={vista === "ingresos" ? "Ingresos Totales" : "Gastos Totales"}
              value={valor}
              variant={vista === "ingresos" ? "income" : "expense"}
            />
          </Card>

          <button className="flecha-cambio" onClick={cambiarVista} aria-label="Ver ingresos" disabled={sinDatos}>
            <Icon nombre="chevronForward" aria-hidden="true" />
          </button>
        </div>

        <div className="ahorr-card tarjeta-grafica">
          <div className="header-grafica">
            <strong className="titulo-grafica">
              MIS {vista.toUpperCase()}
            </strong>

            <Button
              variant="ghost"
              size="small"
              onClick={() => history.push(`/salud-detalles?tipo=${vista}`)}
            >
              Ver detalles
            </Button>
          </div>

          {sinDatos ? (
            <EmptyState
              icono="wallet"
              titulo="Sin movimientos"
              descripcion="Registra tu primer ingreso o gasto para ver tu salud financiera."
              accion={
                <Button variant="primary" onClick={() => history.push('/ingreso')}>
                  Añadir ingreso
                </Button>
              }
            />
          ) : (
            <div className="contenedor-canvas">
              <DoughnutChart valor={valor} color={color} label={label} />
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
