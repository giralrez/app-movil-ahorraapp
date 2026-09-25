import React from 'react';
import { IonIcon } from '@ionic/react';
import {
  chevronBack,
  chevronForward,
  add,
  warning,
  wallet,
  receipt,
  fileTray,
  documentText
} from 'ionicons/icons';

const ICONOS = {
  chevronBack,
  chevronForward,
  add,
  warning,
  wallet,
  receipt,
  fileTray,
  documentText
};

export default function Icon({ nombre, ...props }) {
  return <IonIcon icon={ICONOS[nombre] || fileTray} {...props} />;
}
