import React, { useState, useEffect } from 'react';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import Inicio from './paginas/Inicio';
import Principal from './paginas/Principal';
import SaludFinanciera from './paginas/SaludFinanciera';
import FormularioIngreso from './paginas/FormularioIngreso';
import FormularioGasto from './paginas/FormularioGasto';
import SaludDetalles from './paginas/SaludDetalles';  
import { obtenerUsuario } from './almacenamiento';
export default function App() {
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    setUsuario(obtenerUsuario());
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <Switch>
          <Route path="/inicio" component={Inicio} />
          <Route path="/principal" component={Principal} />
          <Route path="/salud" component={SaludFinanciera} />
          <Route path="/salud-detalles" component={SaludDetalles} /> 
          <Route path="/ingreso" component={FormularioIngreso} />
          <Route path="/gasto" component={FormularioGasto} />

          <Redirect to={usuario ? "/principal" : "/inicio"} />
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
}