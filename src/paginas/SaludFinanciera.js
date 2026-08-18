import React, { useEffect, useState, useRef } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from "@ionic/react";

import { obtenerTransacciones } from "../almacenamiento";
import Chart from "chart.js/auto";
import { useHistory } from "react-router-dom";



export default function SaludFinanciera() {
  const history = useHistory();
  const [vista, setVista] = useState("ingresos");
  const [transacciones, setTransacciones] = useState([]);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  //  CARGA DE DATOS
  useEffect(() => {
    setTransacciones(obtenerTransacciones());
  }, []);

  const ingresosTotal = transacciones
    .filter((t) => t.tipo === "ingreso")
    .reduce((s, t) => s + Number(t.monto), 0);

  const gastosTotal = transacciones
    .filter((t) => t.tipo === "gasto")
    .reduce((s, t) => s + Number(t.monto), 0);

  //   CONFIGURAR GRÁFICO
  const actualizarGrafico = () => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const valor = vista === "ingresos" ? ingresosTotal : gastosTotal;
    const color = vista === "ingresos" ? "#2ecc71" : "#e74c3c";
    const label = vista === "ingresos" ? "Ingresos" : "Gastos";

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: [label],
        datasets: [
          {
            data: [valor],
            backgroundColor: [color]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%"
      }
    });
  };

  useEffect(() => {
    actualizarGrafico();
  }, [vista, transacciones]);

 
  //   CAMBIAR VISTA}
  const cambiarVista = () => {
    setVista(vista === "ingresos" ? "gastos" : "ingresos");
  };

  //      UI
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="salud-titulo">Mi Salud Financiera</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding salud-fondo">
        
        {/* TARJETA CENTRAL CON FLECHAS */}
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
              $
              {(vista === "ingresos" ? ingresosTotal : gastosTotal).toLocaleString()}
            </p>
          </div>

          <button className="flecha-cambio" onClick={cambiarVista}>
            ›
          </button>
        </div>

        {/* TARJETA CON GRÁFICA */}
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
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
