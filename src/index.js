import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Estilos base OBLIGATORIOS de Ionic
import '@ionic/react/css/core.css';
import '@ionic/react/css/ionic.bundle.css';  // NECESARIO para IonSelect
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/tema.css';

// Habilita popovers, cámara, file picker, etc.
import { defineCustomElements } from '@ionic/pwa-elements/loader';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
defineCustomElements(window);
