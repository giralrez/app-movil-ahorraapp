import React from 'react';
import { IonButton, IonSpinner } from '@ionic/react';

export default function Button({
  variant = 'primary',
  block = false,
  loading = false,
  children,
  className,
  disabled,
  ...props
}) {
  const clases = [
    'ahorr-btn',
    `ahorr-btn--${variant}`,
    block ? 'ahorr-btn--block' : '',
    loading ? 'ahorr-btn--loading' : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <IonButton
      className={clases}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <IonSpinner name="crescent" size="small" /> : children}
    </IonButton>
  );
}
