import React from 'react';
import { IonSpinner } from '@ionic/react';

export default function LoadingState({ titulo = 'Cargando…' }) {
  return (
    <div className="ahorr-state" role="status" aria-live="polite">
      <IonSpinner name="crescent" aria-label={titulo} />
      <p className="ahorr-state__description">{titulo}</p>
    </div>
  );
}
