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
      <Route path="/inicio" component={Inicio} />
      <Route path="/principal" component={Principal} />
      <Route path="/salud" component={SaludFinanciera} />
      <Route path="/salud-detalles" component={SaludDetalles} />
      <Route path="/ingreso" component={FormularioIngreso} />
      <Route path="/gasto" component={FormularioGasto} />

      <Redirect to={usuario ? "/principal" : "/inicio"} />
    </Switch>
  );
}