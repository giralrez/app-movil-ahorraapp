import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Inicio from '../../pages/Inicio';
import Principal from '../../pages/Principal';
import SaludFinanciera from '../../pages/SaludFinanciera';
import FormularioIngreso from '../../pages/FormularioIngreso';
import FormularioGasto from '../../pages/FormularioGasto';
import SaludDetalles from '../../pages/SaludDetalles';
import { useApp } from '../context/AppContext';

export default function AppRoutes() {
  const { usuario } = useApp();

  return (
    <Switch>
      <Route exact path="/inicio" component={Inicio} />
      <Route exact path="/principal" component={Principal} />
      <Route exact path="/salud-detalles" component={SaludDetalles} />
      <Route exact path="/salud" component={SaludFinanciera} />
      <Route exact path="/ingreso" component={FormularioIngreso} />
      <Route exact path="/gasto" component={FormularioGasto} />

      <Redirect to={usuario ? "/principal" : "/inicio"} />
    </Switch>
  );
}
