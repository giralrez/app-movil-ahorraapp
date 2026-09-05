import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getUsuario, getTransacciones } from '../services/storage/storageService';
import { calculateIncome, calculateExpenses } from '../utils/financial';
import { formatCurrency } from '../utils/format';

export default function Principal() {
  const history = useHistory();
  const usuario = getUsuario() || 'Usuario';
  const transacciones = getTransacciones();

  const ingresos = calculateIncome(transacciones);
  const gastos = calculateExpenses(transacciones);
  const balanceNegativo = gastos > ingresos;

  return (
    <IonPage>
      <IonContent className="fondo-app">

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
                {formatCurrency(ingresos)}
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard className="card-blanca">
            <IonCardContent>
              <p className="titulo-tarjeta">Gastos totales</p>
              <p className="monto gasto">
                {formatCurrency(gastos)}
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