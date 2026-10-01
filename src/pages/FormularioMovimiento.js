import React, { useMemo, useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  CATEGORIAS_INGRESO,
  CATEGORIAS_GASTO,
  METODOS_PAGO,
  TIPOS_TRANSACCION
} from '../domain/transactions';
import { useApp } from '../app/context/AppContext';
import { AmountInput, Button, EmptyState, Icon, Input, Select } from '../components/ui';

const ETIQUETAS_TIPO = { ingreso: 'Ingreso', gasto: 'Gasto' };

function categoriasDe(tipo) {
  return tipo === 'gasto' ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO;
}

export default function FormularioMovimiento({ tipoInicial }) {
  const history = useHistory();
  const location = useLocation();
  const { transacciones, agregarTransaccion, actualizarTransaccion } = useApp();

  const params = new URLSearchParams(location.search);
  const editarId = params.get('editar');
  const editando = Boolean(editarId);
  const existente = editando ? transacciones.find((t) => t.id === editarId) : null;

  const [tipo, setTipo] = useState(
    (editando && existente ? existente.tipo : null) ||
      tipoInicial ||
      params.get('tipo') ||
      'ingreso'
  );
  const [categoria, setCategoria] = useState(
    (editando && existente ? existente.categoria : null) || categoriasDe(tipo)[0]
  );
  const [monto, setMonto] = useState(editando && existente ? String(existente.monto) : '');
  const [fecha, setFecha] = useState(
    (editando && existente ? existente.fecha : null) || new Date().toISOString().slice(0, 10)
  );
  const [metodoPago, setMetodoPago] = useState(
    (editando && existente ? existente.metodoPago : '') || METODOS_PAGO[0]
  );
  const [descripcion, setDescripcion] = useState(
    editando && existente ? existente.descripcion || '' : ''
  );
  const [errorMonto, setErrorMonto] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const opcionesCategoria = useMemo(() => categoriasDe(tipo), [tipo]);

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    if (!categoriasDe(nuevoTipo).includes(categoria)) {
      setCategoria(categoriasDe(nuevoTipo)[0]);
    }
  };

  const guardar = () => {
    const numero = Number(monto);
    if (!monto || !Number.isFinite(numero) || numero <= 0) {
      setErrorMonto('Ingresa un monto válido mayor a cero');
      return;
    }

    const datos = { tipo, categoria, monto: numero, fecha, metodoPago, descripcion };
    const resultado = editando
      ? actualizarTransaccion(editarId, datos)
      : agregarTransaccion(datos);

    if (!resultado.ok) {
      setErrorMonto('');
      setErrorForm(resultado.error);
      return;
    }

    setErrorMonto('');
    setErrorForm('');
    const origen = (history.location.state && history.location.state.origen) || '';
    history.push(editando || origen === 'historial' ? '/historial' : '/principal');
  };

  if (editando && !existente) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="btn-volver">
            <Button variant="ghost" block onClick={() => history.push('/historial')}>
              <Icon nombre="chevronBack" aria-hidden="true" /> Volver al historial
            </Button>
          </div>
          <EmptyState
            icono="fileTray"
            titulo="Transacción no encontrada"
            descripcion="El movimiento que intentas editar ya no existe."
          />
        </IonContent>
      </IonPage>
    );
  }

  const titulo = editando
    ? 'Editar movimiento'
    : `Añadir ${ETIQUETAS_TIPO[tipo]}`;

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

        <h2 className="form-titulo">{titulo}</h2>

        <form
          className="ahorr-card form-card"
          onSubmit={(e) => {
            e.preventDefault();
            guardar();
          }}
        >

          <Select
            label="Tipo"
            id="movimiento-tipo"
            options={TIPOS_TRANSACCION.map((t) => ETIQUETAS_TIPO[t])}
            value={ETIQUETAS_TIPO[tipo]}
            onChange={(e) => {
              const seleccionado = TIPOS_TRANSACCION.find((t) => ETIQUETAS_TIPO[t] === e.target.value);
              cambiarTipo(seleccionado || 'ingreso');
            }}
          />

          <Select
            label="Categoría"
            options={opcionesCategoria}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <AmountInput
            label="Monto"
            value={monto}
            onChange={(valor) => {
              setMonto(valor);
              if (errorMonto) setErrorMonto('');
              if (errorForm) setErrorForm('');
            }}
            error={errorMonto}
          />

          <Input
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <Select
            label="Método de pago"
            options={METODOS_PAGO}
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          />

          <Input
            label="Descripción (opcional)"
            type="text"
            maxLength={80}
            placeholder="Ej. Almuerzo con compañeros"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {errorForm && (
            <p className="ahorr-field__message ahorr-field__message--error" role="alert">
              ⚠ {errorForm}
            </p>
          )}

          <Button
            type="submit"
            variant={editando ? 'primary' : tipo === 'gasto' ? 'expense' : 'success'}
            block
          >
            {editando ? 'Guardar cambios' : 'Guardar'}
          </Button>

        </form>
      </IonContent>
    </IonPage>
  );
}
