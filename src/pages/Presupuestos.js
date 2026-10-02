import React, { useMemo, useState } from 'react';
import { IonPage, IonContent, IonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useApp } from '../app/context/AppContext';
import { Button, Card, EmptyState, Icon } from '../components/ui';
import { BudgetCard } from '../components/financial';
import BudgetForm from '../features/budgets/BudgetForm';
import { presupuestosConProgreso } from '../features/budgets/BudgetCalculations';
import { cadenaFecha } from '../utils/dates';
import { formatCurrency } from '../utils/format';

const ETIQUETAS_PERIODO = { mensual: 'mensual', semanal: 'semanal', anual: 'anual' };

export default function Presupuestos() {
  const history = useHistory();
  const {
    transacciones,
    presupuestos,
    agregarPresupuesto,
    actualizarPresupuesto,
    eliminarPresupuesto
  } = useApp();

  const [formAbierto, setFormAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const hoy = cadenaFecha(new Date());
  const lista = useMemo(
    () => presupuestosConProgreso(presupuestos, transacciones, hoy),
    [presupuestos, transacciones, hoy]
  );
  const enAlerta = useMemo(() => lista.filter((p) => p.estado !== 'ok'), [lista]);
  const editando = editandoId ? presupuestos.find((p) => p.id === editandoId) : null;

  const abrirNuevo = () => {
    setEditandoId(null);
    setFormAbierto(true);
    setMensaje('');
    setError('');
  };

  const abrirEdicion = (presupuesto) => {
    setEditandoId(presupuesto.id);
    setFormAbierto(true);
    setMensaje('');
    setError('');
  };

  const cancelar = () => {
    setFormAbierto(false);
    setEditandoId(null);
  };

  const guardar = (datos) => {
    const resultado = editando
      ? actualizarPresupuesto(editandoId, datos)
      : agregarPresupuesto(datos);

    if (resultado.ok) {
      setError('');
      setMensaje(editando ? 'Presupuesto actualizado.' : 'Presupuesto creado.');
      cancelar();
    } else {
      setMensaje('');
    }
    return resultado;
  };

  const confirmarEliminacion = () => {
    if (!aEliminar) return;
    const resultado = eliminarPresupuesto(aEliminar.id);
    if (resultado.ok) {
      if (aEliminar.id === editandoId) cancelar();
      setError('');
      setMensaje('Presupuesto eliminado.');
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

        <h2 className="form-titulo">Mis presupuestos</h2>

        <div className="dashboard">
          {enAlerta.length > 0 && (
            <Card variant="alert" aria-live="polite">
              <Icon nombre="warning" aria-hidden="true" />{' '}
              {enAlerta.length === 1
                ? '1 presupuesto está cerca del límite o superado.'
                : `${enAlerta.length} presupuestos están cerca del límite o superados.`}
            </Card>
          )}

          <div className="ahorr-lista-header">
            <p className="ahorr-lista-info" aria-live="polite">
              {lista.length === 1 ? '1 presupuesto' : `${lista.length} presupuestos`}
            </p>
            {!formAbierto && (
              <Button variant="primary" size="small" onClick={abrirNuevo}>
                Nuevo presupuesto
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
            <BudgetForm
              key={editandoId || 'nuevo'}
              inicial={editando}
              onGuardar={guardar}
              onCancelar={cancelar}
            />
          )}

          {lista.length === 0 ? (
            !formAbierto && (
              <Card>
                <EmptyState
                  icono="wallet"
                  titulo="Aún no hay presupuestos"
                  descripcion="Define límites de gasto por categoría o para todo tu gasto."
                  accion={
                    <div className="ahorr-empty-acciones">
                      <Button variant="primary" size="small" onClick={abrirNuevo}>
                        Crear presupuesto
                      </Button>
                    </div>
                  }
                />
              </Card>
            )
          ) : (
            <div className="ahorr-lista">
              {lista.map((p) => (
                <BudgetCard
                  key={p.id}
                  presupuesto={p}
                  onEditar={abrirEdicion}
                  onEliminar={setAEliminar}
                />
              ))}
            </div>
          )}
        </div>

        <IonAlert
          isOpen={Boolean(aEliminar)}
          header="Eliminar presupuesto"
          message={
            aEliminar
              ? `¿Eliminar el presupuesto "${aEliminar.nombre}" con límite ${formatCurrency(
                  aEliminar.montoLimite
                )} (${ETIQUETAS_PERIODO[aEliminar.periodo] || aEliminar.periodo})?`
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
