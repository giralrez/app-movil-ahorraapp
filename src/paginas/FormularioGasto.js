import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonLabel, IonButton
} from '@ionic/react';
import { obtenerTransacciones, guardarTransacciones } from '../almacenamiento';
import { useHistory } from 'react-router-dom';

export default function FormularioGasto() {
  const history = useHistory();
  const [categoria, setCategoria] = useState('Comida');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

  const guardar = () => {
    if (!monto) return alert('Ingrese un monto válido');

    const lista = obtenerTransacciones();
    lista.push({ tipo: 'gasto', categoria, monto: Number(monto), fecha });
    guardarTransacciones(lista);
    history.push('/principal');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">

        <div className="header-principal" style={{ textAlign: "center", marginTop: "15px" }}>
          <img
            src="/imagenes/logo.png.png"
            alt="AhorrApp logo"
            style={{ width: "140px", marginBottom: "5px" }}
          />
        </div>

        <h2 className="form-titulo">Añadir Gasto</h2>

        <div className="form-card">

          <IonItem className="form-item">
            <IonLabel position="stacked">Categoría</IonLabel>

            <select
              className="select-simple"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="Comida">Comida</option>
              <option value="Transporte">Transporte</option>
              <option value="Servicios">Servicios</option>
              <option value="Otro">Otro</option>
            </select>
          </IonItem>

          <IonItem className="form-item">
            <IonLabel position="stacked">Monto</IonLabel>
            <input
              type="number"
              className="input-simple"
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel position="stacked">Fecha</IonLabel>
            <input
              type="date"
              className="input-simple"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </IonItem>

          <IonButton expand="block" className="btn-guardar" onClick={guardar}>
            Guardar
          </IonButton>

        </div>
      </IonContent>
    </IonPage>
  );
}