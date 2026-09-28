import React from 'react';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <IonApp>
      <AppProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </AppProvider>
    </IonApp>
  );
}
