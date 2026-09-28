import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Inicio from '../../paginas/Inicio';
import Principal from '../../paginas/Principal';
import SaludFinanciera from '../../paginas/SaludFinanciera';
import FormularioIngreso from '../../paginas/FormularioIngreso';
import FormularioGasto from '../../paginas/FormularioGasto';
import SaludDetalles from '../../paginas/SaludDetalles';

export default function AppRoutes({ usuario }) {
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
