import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonText
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { getTransacciones } from '../services/storage/storageService';
import { calculateIncome, calculateExpenses, montoNumerico } from '../utils/financial';
import { formatCurrency } from '../utils/format';

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

        <h2
          style={{
            textAlign: 'center',
            marginTop: '15px',
            marginBottom: '5px',
            fontWeight: 'bold'
          }}
        >
          Detalles de {esIngresos ? "Ingresos" : "Gastos"}
        </h2>

        <div className="detalle-card encabezado-detalle">
          <h2 className="titulo-detalle">
            {esIngresos ? "Ingresos Totales" : "Gastos Totales"}
          </h2>

          <IonText
            className="total-detalle-grande"
            style={{ color: esIngresos ? "#1EBD61" : "#E63946" }}
          >
            {formatCurrency(total)}
          </IonText>
        </div>

        <div className="btn-volver">
          <IonButton
            expand="block"
            color="medium"
            onClick={() => history.goBack()}
          >
            ← Volver
          </IonButton>
        </div>

        <h3 style={{ marginLeft: "15px", marginTop: "10px" }}>
          Movimientos de {esIngresos ? "Ingresos" : "Gastos"}
        </h3>

        {lista.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "30px", color: "#777" }}>
            No hay movimientos registrados.
          </p>
        ) : (
          lista.map((item, index) => (
            <div className="mov-card" key={item.id || `${item.tipo}-${item.fecha}-${item.monto}-${index}`}>

              <div className="mov-titulo">{item.categoria}</div>

              <div className="mov-fecha">Fecha: {item.fecha}</div>

              <IonText
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: esIngresos ? "#1EBD61" : "#E63946"
                }}
              >
                {formatCurrency(item.monto)}
              </IonText>
            </div>
          ))
        )}
      </IonContent>
    </IonPage>
  );
}