import React, { useCallback, useMemo, useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useApp } from '../app/context/AppContext';
import { useTransactions } from '../hooks/useTransactions';
import { Button, Card, Icon } from '../components/ui';
import {
  BalanceCard,
  IncomeExpenseSummary,
  MonthlyTrend,
  CategoryChart,
  PeriodSelector,
  RecentTransactions,
  SavingsRate
} from '../components/financial';
import { construirPeriodo, getDashboardData } from '../features/dashboard/DashboardService';
import { tendenciaMensual } from '../features/dashboard/FinancialSelectors';

export default function Principal() {
  const history = useHistory();
  const { usuario: nombreUsuario } = useApp();
  const transacciones = useTransactions();
  const usuario = nombreUsuario || 'Usuario';

  const [tipoPeriodo, setTipoPeriodo] = useState('actual');
  const [personalizado, setPersonalizado] = useState({ desde: '', hasta: '' });

  const periodo = useMemo(
    () => construirPeriodo(tipoPeriodo, personalizado),
    [tipoPeriodo, personalizado]
  );
  const dashboard = useMemo(
    () => getDashboardData(transacciones, periodo),
    [transacciones, periodo]
  );
  const tendencia = useMemo(() => tendenciaMensual(transacciones), [transacciones]);

  const irA = useCallback((ruta) => () => history.push(ruta), [history]);
  const balanceNegativo =
    !dashboard.sinTransacciones && dashboard.gastos > dashboard.ingresos;

  const rangoVisible =
    tipoPeriodo === 'personalizado'
      ? personalizado.desde && personalizado.hasta
        ? `${personalizado.desde} — ${personalizado.hasta}`
        : 'Selecciona las dos fechas'
      : `${periodo.desde} — ${periodo.hasta}`;

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
            onClick={irA('/salud')}
          >
            Ver más
          </Button>
        </div>

        <div className="dashboard">
          <BalanceCard saldo={dashboard.saldo} />

          <PeriodSelector
            tipo={tipoPeriodo}
            personalizado={personalizado}
            onChangeTipo={setTipoPeriodo}
            onChangePersonalizado={setPersonalizado}
          />

          <p className="dashboard__periodo-info" aria-live="polite">
            {dashboard.etiquetaPeriodo} · {rangoVisible}
          </p>

          <div className="contenedor-tarjetas">
            <IncomeExpenseSummary ingresos={dashboard.ingresos} gastos={dashboard.gastos} />
            <SavingsRate ahorroNeto={dashboard.ahorroNeto} tasaAhorro={dashboard.tasaAhorro} />
          </div>

          <div className="botones-acciones">
            <Button variant="income" block onClick={irA('/ingreso')}>
              <Icon nombre="add" aria-hidden="true" /> Añadir Ingreso
            </Button>

            <Button variant="expense" block onClick={irA('/gasto')}>
              <Icon nombre="add" aria-hidden="true" /> Añadir Gasto
            </Button>
          </div>

          {balanceNegativo && (
            <Card variant="alert">
              <Icon nombre="warning" aria-hidden="true" /> Tus gastos superan tus ingresos en este período. ¡Cuidado con el sobreendeudamiento!
            </Card>
          )}

          <div className="contenedor-tarjetas">
            <CategoryChart categorias={dashboard.categorias} />
            <MonthlyTrend tendencia={tendencia} />
          </div>

          <RecentTransactions
            transacciones={dashboard.ultimas}
            onVerHistorial={irA('/historial')}
          />
        </div>

      </IonContent>
    </IonPage>
  );
}
