import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { obtenerUsuario, obtenerTransacciones } from '../almacenamiento';

export default function Principal() {
  const history = useHistory();
  const usuario = obtenerUsuario() || 'Usuario';
  const transacciones = obtenerTransacciones();

  const ingresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((a, b) => a + b.monto, 0);

  const gastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((a, b) => a + b.monto, 0);

  const balanceNegativo = gastos > ingresos;

  return (
    <IonPage>
      <IonContent className="fondo-app">

        {/* Logo y título */}
        <div className="header-principal" style={{ textAlign: "center", marginTop: "15px" }}>
          <img
            src="/imagenes/logo.png.png"
            alt="AhorrApp logo"
            style={{ width: "140px", marginBottom: "5px" }}
          />
        </div>

        <div className="bienvenida-banner">
          Bienvenido, {usuario}
        </div>

        <div className="salud-header">
          <h2 className="titulo-seccion">Mi salud financiera</h2>

          <IonButton
            size="small"
            className="boton-vermas"
            onClick={() => history.push('/salud')}
          >
            Ver más
          </IonButton>
        </div>

        <div className="contenedor-tarjetas">

          <IonCard className="card-blanca">
            <IonCardContent>
              <p className="titulo-tarjeta">Ingresos totales</p>
              <p className="monto ingreso">
                ${ingresos.toLocaleString()}
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard className="card-blanca">
            <IonCardContent>
              <p className="titulo-tarjeta">Gastos totales</p>
              <p className="monto gasto">
                ${gastos.toLocaleString()}
              </p>
            </IonCardContent>
          </IonCard>

        </div>

        <div className="botones-acciones">
          <IonButton className="btn-ingreso" onClick={() => history.push('/ingreso')}>
            + Añadir Ingreso
          </IonButton>

          <IonButton className="btn-gasto" onClick={() => history.push('/gasto')}>
            + Añadir Gasto
          </IonButton>
        </div>
        {balanceNegativo && (
          <IonCard className="alerta-card">
            <IonCardContent>
              ⚠️ Tus gastos superan tus ingresos. ¡Cuidado con el sobreendeudamiento!
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
}

