import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getUsuario, getTransacciones } from '../services/storage/storageService';
import { calculateIncome, calculateExpenses } from '../utils/financial';
import { Button, Card, FinancialMetric } from '../components/ui';

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

          <Button
            variant="primary"
            size="small"
            onClick={() => history.push('/salud')}
          >
            Ver más
          </Button>
        </div>

        <div className="contenedor-tarjetas">
          <Card>
            <FinancialMetric label="Ingresos totales" value={ingresos} variant="income" />
          </Card>
          <Card>
            <FinancialMetric label="Gastos totales" value={gastos} variant="expense" />
          </Card>
        </div>

        <div className="botones-acciones">
          <Button variant="income" block onClick={() => history.push('/ingreso')}>
            + Añadir Ingreso
          </Button>

          <Button variant="expense" block onClick={() => history.push('/gasto')}>
            + Añadir Gasto
          </Button>
        </div>

        {balanceNegativo && (
          <Card variant="alert">
            ⚠️ Tus gastos superan tus ingresos. ¡Cuidado con el sobreendeudamiento!
          </Card>
        )}

      </IonContent>
    </IonPage>
  );
}
