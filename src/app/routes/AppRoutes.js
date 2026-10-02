import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Inicio from '../../pages/Inicio';
import Principal from '../../pages/Principal';
import SaludFinanciera from '../../pages/SaludFinanciera';
import FormularioMovimiento from '../../pages/FormularioMovimiento';
import Historial from '../../pages/Historial';
import SaludDetalles from '../../pages/SaludDetalles';
import Presupuestos from '../../pages/Presupuestos';
import Metas from '../../pages/Metas';
import { useApp } from '../context/AppContext';

export default function AppRoutes() {
  const { usuario } = useApp();

  return (
    <Switch>
      <Route exact path="/inicio" component={Inicio} />
      <Route exact path="/principal" component={Principal} />
      <Route exact path="/salud-detalles" component={SaludDetalles} />
      <Route exact path="/salud" component={SaludFinanciera} />
      <Route exact path="/historial" component={Historial} />
      <Route exact path="/presupuestos" component={Presupuestos} />
      <Route exact path="/metas" component={Metas} />
      <Route exact path="/movimiento" component={FormularioMovimiento} />
      <Route
        exact
        path="/ingreso"
        render={(props) => <FormularioMovimiento {...props} tipoInicial="ingreso" />}
      />
      <Route
        exact
        path="/gasto"
        render={(props) => <FormularioMovimiento {...props} tipoInicial="gasto" />}
      />

      <Redirect to={usuario ? "/principal" : "/inicio"} />
    </Switch>
  );
}
