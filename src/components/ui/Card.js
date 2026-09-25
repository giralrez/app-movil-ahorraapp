import React from 'react';
import { IonCard, IonCardContent } from '@ionic/react';

export default function Card({ variant = 'default', children, className, ...props }) {
  const clases = [
    'ahorr-card',
    variant !== 'default' ? `ahorr-card--${variant}` : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <IonCard className={clases} {...props}>
      <IonCardContent>{children}</IonCardContent>
    </IonCard>
  );
}
