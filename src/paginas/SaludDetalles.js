import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonText
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { obtenerTransacciones } from '../almacenamiento';

export default function SaludDetalle() {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get('tipo'); // ingresos | gastos

  const [total, setTotal] = useState(0);
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const transacciones = obtenerTransacciones() || [];

    const tipoTransaccion = tipo.toLowerCase();

    const filtrados = transacciones.filter((t) => {
      const tTipo = t.tipo.toLowerCase();
      return (
        tTipo === tipoTransaccion ||
        tTipo === tipoTransaccion.slice(0, -1)
      );
    });

    setLista(filtrados);

    const totalCalculado = filtrados.reduce((acc, t) => acc + Number(t.monto), 0);
    setTotal(totalCalculado);
  }, [tipo]);

  return (
    <IonPage>
      <IonContent className="ion-padding detalles-fondo">

        {/* Título */} 
        <h2
          style={{
            textAlign: 'center',
            marginTop: '15px',
            marginBottom: '5px',
            fontWeight: 'bold'
          }}
        >
          Detalles de {tipo === "ingresos" ? "Ingresos" : "Gastos"}
        </h2>

        {/* Tarjeta */}
        <div className="detalle-card encabezado-detalle">
  <h2 className="titulo-detalle">
    {tipo === "ingresos" ? "Ingresos Totales" : "Gastos Totales"}
  </h2>

  <IonText
    className="total-detalle-grande"
    style={{ color: tipo === "ingresos" ? "#1EBD61" : "#E63946" }}
  >
    ${total.toLocaleString()}
  </IonText>
</div>

        {/* Botón volver */}
        <div className="btn-volver">
          <IonButton
            expand="block"
            color="medium"
            onClick={() => history.goBack()}
          >
            ← Volver
          </IonButton>
        </div>

       {/* Subtítulo */}
        <h3 style={{ marginLeft: "15px", marginTop: "10px" }}>
          Movimientos de {tipo === "ingresos" ? "Ingresos" : "Gastos"}
        </h3>

        {/* Lista de tarjetas */}
        {lista.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "30px", color: "#777" }}>
            No hay movimientos registrados.
          </p>
        ) : (
          lista.map((item, index) => (
            <div className="mov-card" key={index}>
              
              <div className="mov-titulo">{item.categoria}</div>

              <div className="mov-fecha">Fecha: {item.fecha}</div>

              <IonText
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: tipo === "ingresos" ? "#1EBD61" : "#E63946"
                }}
              >
                ${Number(item.monto).toLocaleString()}
              </IonText>
            </div>
          ))
        )}
      </IonContent>
    </IonPage>
  );
}