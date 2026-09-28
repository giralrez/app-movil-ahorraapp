import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { CATEGORIAS_GASTO } from '../domain/transactions';
import { useHistory } from 'react-router-dom';
import { useApp } from '../app/context/AppContext';
import { Button, Input, Select, AmountInput, Icon } from '../components/ui';

export default function FormularioGasto() {
  const history = useHistory();
  const { agregarTransaccion } = useApp();
  const [categoria, setCategoria] = useState(CATEGORIAS_GASTO[0]);
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [errorMonto, setErrorMonto] = useState('');

  const guardar = () => {
    const numero = Number(monto);
    if (!monto || !Number.isFinite(numero) || numero <= 0) {
      setErrorMonto('Ingresa un monto válido mayor a cero');
      return;
    }

    const resultado = agregarTransaccion({ tipo: 'gasto', categoria, monto: numero, fecha });
    if (!resultado.ok) {
      setErrorMonto(resultado.error);
      return;
    }

    setErrorMonto('');
    history.push('/principal');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">

        <div className="header-principal">
          <img
            src="/imagenes/logo.png.png"
            alt="AhorrApp logo"
            className="logo-app"
          />
        </div>

        <div className="btn-volver">
          <Button variant="ghost" block onClick={() => history.goBack()}>
            <Icon nombre="chevronBack" aria-hidden="true" /> Volver
          </Button>
        </div>

        <h2 className="form-titulo">Añadir Gasto</h2>

        <div className="ahorr-card form-card">

          <Select
            label="Categoría"
            options={CATEGORIAS_GASTO}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <AmountInput
            label="Monto"
            value={monto}
            onChange={(valor) => {
              setMonto(valor);
              if (errorMonto) setErrorMonto('');
            }}
            error={errorMonto}
          />

          <Input
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <Button variant="success" block onClick={guardar}>
            Guardar
          </Button>

        </div>
      </IonContent>
    </IonPage>
  );
}
