import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { calculateIncome, calculateExpenses } from '../utils/financial';
import { useApp } from '../app/context/AppContext';
import { Button, Card, FinancialMetric, Icon } from '../components/ui';

export default function Principal() {
  const history = useHistory();
  const { usuario: nombreUsuario, transacciones } = useApp();
  const usuario = nombreUsuario || 'Usuario';

  const ingresos = calculateIncome(transacciones);
  const gastos = calculateExpenses(transacciones);
  const balanceNegativo = gastos > ingresos;

  return (
    <IonPage>
      <IonContent className="fondo-app">

        <div className="header-principal">
          <img
            src="/imagenes/logo.png.png"
            alt="AhorrApp logo"
            className="logo-app"
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
            <Icon nombre="add" aria-hidden="true" /> Añadir Ingreso
          </Button>

          <Button variant="expense" block onClick={() => history.push('/gasto')}>
            <Icon nombre="add" aria-hidden="true" /> Añadir Gasto
          </Button>
        </div>

        {balanceNegativo && (
          <Card variant="alert">
            <Icon nombre="warning" aria-hidden="true" /> Tus gastos superan tus ingresos. ¡Cuidado con el sobreendeudamiento!
          </Card>
        )}

      </IonContent>
    </IonPage>
  );
}
