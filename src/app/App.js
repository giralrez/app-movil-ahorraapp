import React, { useState, useEffect } from 'react';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import AppRoutes from './routes/AppRoutes';
import { getUsuario } from '../services/storage/storageService';

export default function App() {
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    setUsuario(getUsuario());
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <AppRoutes usuario={usuario} />
      </IonReactRouter>
    </IonApp>
  );
}