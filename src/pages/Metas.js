import React, { useMemo, useState } from 'react';
import { IonPage, IonContent, IonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useApp } from '../app/context/AppContext';
import { Button, Card, EmptyState, Icon } from '../components/ui';
import { SavingsGoalCard } from '../components/financial';
import GoalForm from '../features/goals/GoalForm';
import ContributionForm from '../features/goals/ContributionForm';
import { metasConProgreso } from '../features/goals/GoalCalculations';
import { cadenaFecha } from '../utils/dates';
import { formatCurrency } from '../utils/format';

export default function Metas() {
  const history = useHistory();
  const {
    metas,
    agregarMeta,
    actualizarMeta,
    eliminarMeta,
    aportarAMeta,
    retirarDeMeta
  } = useApp();

  const [formAbierto, setFormAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [aportandoId, setAportandoId] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const hoy = cadenaFecha(new Date());
  const lista = useMemo(() => metasConProgreso(metas, hoy), [metas, hoy]);
  const editando = editandoId ? metas.find((m) => m.id === editandoId) : null;
  const aportando = aportandoId ? metas.find((m) => m.id === aportandoId) : null;

  const abrirNuevo = () => {
    setEditandoId(null);
    setAportandoId(null);
    setFormAbierto(true);
    setMensaje('');
    setError('');
  };

  const abrirEdicion = (meta) => {
    setEditandoId(meta.id);
    setAportandoId(null);
    setFormAbierto(true);
    setMensaje('');
    setError('');
  };

  const abrirAportes = (meta) => {
    setAportandoId(meta.id);
    setEditandoId(null);
    setFormAbierto(false);
    setMensaje('');
    setError('');
  };

  const cancelar = () => {
    setFormAbierto(false);
    setEditandoId(null);
    setAportandoId(null);
  };

  const guardar = (datos) => {
    const resultado = editando
      ? actualizarMeta(editandoId, datos)
      : agregarMeta(datos);

    if (resultado.ok) {
      setError('');
      setMensaje(editando ? 'Meta actualizada.' : 'Meta creada.');
      cancelar();
    } else {
      setMensaje('');
    }
    return resultado;
  };

  const confirmarAporte = (operacion, monto) => {
    const resultado =
      operacion === 'aportar'
        ? aportarAMeta(aportandoId, monto)
        : retirarDeMeta(aportandoId, monto);

    if (resultado.ok) {
      setError('');
      setMensaje(operacion === 'aportar' ? 'Aporte registrado.' : 'Retiro registrado.');
    } else {
      setMensaje('');
    }
    return resultado;
  };

  const confirmarEliminacion = () => {
    if (!aEliminar) return;
    const resultado = eliminarMeta(aEliminar.id);
    if (resultado.ok) {
      if (aEliminar.id === editandoId) cancelar();
      setError('');
      setMensaje('Meta eliminada.');
      if (aportandoId === aEliminar.id) setAportandoId(null);
    } else {
      setMensaje('');
      setError(resultado.error);
    }
  };

  return (
    <IonPage>
      <IonContent className="fondo-app">

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

        <h2 className="form-titulo">Mis metas de ahorro</h2>

        <div className="dashboard">
          <div className="ahorr-lista-header">
            <p className="ahorr-lista-info" aria-live="polite">
              {lista.length === 1 ? '1 meta' : `${lista.length} metas`}
            </p>
            {!formAbierto && (
              <Button variant="primary" size="small" onClick={abrirNuevo}>
                Nueva meta
              </Button>
            )}
          </div>

          {mensaje && (
            <p className="ahorr-field__message ahorr-field__message--success" aria-live="polite">
              {mensaje}
            </p>
          )}

          {error && (
            <p className="ahorr-field__message ahorr-field__message--error" role="alert">
              ⚠ {error}
            </p>
          )}

          {formAbierto && (
            <GoalForm
              key={editandoId || 'nuevo'}
              inicial={editando}
              onGuardar={guardar}
              onCancelar={cancelar}
            />
          )}

          {aportando && (
            <ContributionForm
              key={aportandoId}
              meta={aportando}
              onConfirmar={confirmarAporte}
              onCancelar={() => setAportandoId(null)}
            />
          )}

          {lista.length === 0 ? (
            !formAbierto && (
              <Card>
                <EmptyState
                  icono="trophy"
                  titulo="Aún no hay metas"
                  descripcion="Crea una meta y haz aportes manuales para alcanzarla."
                  accion={
                    <div className="ahorr-empty-acciones">
                      <Button variant="primary" size="small" onClick={abrirNuevo}>
                        Crear meta
                      </Button>
                    </div>
                  }
                />
              </Card>
            )
          ) : (
            <div className="ahorr-lista">
              {lista.map((m) => (
                <SavingsGoalCard
                  key={m.id}
                  meta={m}
                  onEditar={abrirEdicion}
                  onEliminar={setAEliminar}
                  onAportar={abrirAportes}
                />
              ))}
            </div>
          )}
        </div>

        <IonAlert
          isOpen={Boolean(aEliminar)}
          header="Eliminar meta"
          message={
            aEliminar
              ? `¿Eliminar la meta "${aEliminar.nombre}" de ${formatCurrency(
                  aEliminar.montoObjetivo
                )}? Se perderá el progreso actual.`
              : ''
          }
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: confirmarEliminacion
            }
          ]}
          onDidDismiss={() => setAEliminar(null)}
        />

      </IonContent>
    </IonPage>
  );
}
