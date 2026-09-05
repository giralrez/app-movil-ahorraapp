import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from "@ionic/react";

import { useTransactions } from "../hooks/useTransactions";
import { calculateIncome, calculateExpenses } from "../utils/financial";
import { formatCurrency } from "../utils/format";
import DoughnutChart from "../components/charts/DoughnutChart";
import { useHistory } from "react-router-dom";

export default function SaludFinanciera() {
  const history = useHistory();
  const [vista, setVista] = useState("ingresos");
  const transacciones = useTransactions();

  const ingresosTotal = calculateIncome(transacciones);
  const gastosTotal = calculateExpenses(transacciones);

  const valor = vista === "ingresos" ? ingresosTotal : gastosTotal;
  const color = vista === "ingresos" ? "#2ecc71" : "#e74c3c";
  const label = vista === "ingresos" ? "Ingresos" : "Gastos";

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

        <div className="contenedor-vista">
          <button className="flecha-cambio" onClick={cambiarVista}>
            ‹
          </button>

          <div className="tarjeta-blanca">
            <h2 className="titulo-tarjeta-total">
              {vista === "ingresos" ? "Ingresos Totales" : "Gastos Totales"}
            </h2>

            <p
              className={`valor-total ${
                vista === "ingresos" ? "valor-ingresos" : "valor-gastos"
              }`}
            >
              {formatCurrency(valor)}
            </p>
          </div>

          <button className="flecha-cambio" onClick={cambiarVista}>
            ›
          </button>
        </div>

        <div className="tarjeta-grafica">
          <div className="header-grafica">
            <strong className="titulo-grafica">
              MIS {vista.toUpperCase()}
            </strong>

            <IonButton
              color="primary"
              fill="clear"
              onClick={() => history.push(`/salud-detalles?tipo=${vista}`)}
            >
              Ver detalles
            </IonButton>
          </div>

          <div className="contenedor-canvas">
            <DoughnutChart valor={valor} color={color} label={label} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}