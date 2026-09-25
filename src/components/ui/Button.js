import React from 'react';
import { IonButton, IonSpinner } from '@ionic/react';

export default function Button({
  variant = 'primary',
  block = false,
  loading = false,
  children,
  ...props
}) {
  const clases = [
    'ahorr-btn',
    `ahorr-btn--${variant}`,
    block ? 'ahorr-btn--block' : '',
    loading ? 'ahorr-btn--loading' : ''
  ].filter(Boolean).join(' ');

  return (
    <IonButton
      className={clases}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <IonSpinner name="crescent" size="small" /> : children}
    </IonButton>
  );
}
