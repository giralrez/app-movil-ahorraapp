import React, { useMemo, useState } from 'react';
import { IonPage, IonContent, IonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useApp } from '../app/context/AppContext';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  Input,
  Select,
  TransactionItem
} from '../components/ui';
import { aplicarFiltros } from '../features/transactions/TransactionFilters';
import { formatCurrency } from '../utils/format';

const ETIQUETAS_TIPO = { ingreso: 'Ingreso', gasto: 'Gasto', '' : 'Todos' };
const ETIQUETAS_ORDEN = {
  'fecha-desc': 'Más recientes',
  'fecha-asc': 'Más antiguos',
  'monto-desc': 'Mayor monto',
  'monto-asc': 'Menor monto'
};

export default function Historial() {
  const history = useHistory();
  const { transacciones, eliminarTransaccion } = useApp();

  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [orden, setOrden] = useState('fecha-desc');
  const [aEliminar, setAEliminar] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const categorias = useMemo(() => {
    const presentes = new Set(transacciones.map((t) => t.categoria).filter(Boolean));
    return [...presentes].sort();
  }, [transacciones]);

  const lista = useMemo(
    () => aplicarFiltros(transacciones, { texto, tipo, categoria, desde, hasta, orden }),
    [transacciones, texto, tipo, categoria, desde, hasta, orden]
  );

  const hayFiltros = Boolean(texto || tipo || categoria || desde || hasta);

  const limpiarFiltros = () => {
    setTexto('');
    setTipo('');
    setCategoria('');
    setDesde('');
    setHasta('');
    setMensaje('');
  };

  const confirmarEliminacion = () => {
    if (!aEliminar) return;
    const resultado = eliminarTransaccion(aEliminar.id);
    if (resultado.ok) {
      setError('');
      setMensaje('Movimiento eliminado.');
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

        <h2 className="form-titulo">Historial de movimientos</h2>

        <div className="dashboard">
          <Card className="ahorr-filtros">
            <Input
              label="Buscar"
              id="historial-buscar"
              type="search"
              placeholder="Categoría, descripción, método o fecha"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />

            <div className="ahorr-filtros__doble">
              <Select
                label="Tipo"
                id="historial-tipo"
                options={['Todos', 'Ingreso', 'Gasto']}
                value={ETIQUETAS_TIPO[tipo]}
                onChange={(e) => {
                  const etiqueta = e.target.value;
                  const valor = Object.keys(ETIQUETAS_TIPO).find((k) => ETIQUETAS_TIPO[k] === etiqueta);
                  setTipo(valor ?? '');
                }}
              />
              <Select
                label="Categoría"
                id="historial-categoria"
                options={['Todas', ...categorias]}
                value={categoria || 'Todas'}
                onChange={(e) => setCategoria(e.target.value === 'Todas' ? '' : e.target.value)}
              />
            </div>

            <div className="ahorr-filtros__doble">
              <Input
                label="Desde"
                id="historial-desde"
                type="date"
                max={hasta || undefined}
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
              <Input
                label="Hasta"
                id="historial-hasta"
                type="date"
                min={desde || undefined}
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>

            <Select
              label="Ordenar por"
              id="historial-orden"
              options={Object.values(ETIQUETAS_ORDEN)}
              value={ETIQUETAS_ORDEN[orden]}
              onChange={(e) => {
                const valor = Object.keys(ETIQUETAS_ORDEN).find(
                  (k) => ETIQUETAS_ORDEN[k] === e.target.value
                );
                setOrden(valor || 'fecha-desc');
              }}
            />
          </Card>

          <div className="ahorr-lista-header">
            <p className="ahorr-lista-info" aria-live="polite">
              {lista.length === 1 ? '1 movimiento' : `${lista.length} movimientos`}
            </p>
            {hayFiltros && (
              <Button variant="ghost" size="small" onClick={limpiarFiltros}>
                Limpiar filtros
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

          {lista.length === 0 ? (
            <Card>
              <EmptyState
                icono="fileTray"
                titulo={
                  transacciones.length === 0
                    ? 'Aún no hay movimientos'
                    : hayFiltros
                      ? 'Sin coincidencias'
                      : 'Aún no hay movimientos'
                }
                descripcion={
                  hayFiltros && transacciones.length > 0
                    ? 'Ningún movimiento coincide con los filtros actuales.'
                    : 'Registra tu primer ingreso o gasto para verlo aquí.'
                }
                accion={
                  <div className="ahorr-empty-acciones">
                    {hayFiltros && (
                      <Button variant="ghost" size="small" onClick={limpiarFiltros}>
                        Limpiar filtros
                      </Button>
                    )}
                    {transacciones.length === 0 && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => history.push('/movimiento', { origen: 'historial' })}
                      >
                        Añadir movimiento
                      </Button>
                    )}
                  </div>
                }
              />
            </Card>
          ) : (
            <div className="ahorr-historial">
              {lista.map((t) => (
                <Card key={t.id} className="ahorr-historial-item">
                  <TransactionItem
                    titulo={t.categoria}
                    fecha={t.fecha}
                    monto={t.monto}
                    tipo={t.tipo}
                  />
                  {t.descripcion && (
                    <p className="ahorr-historial-item__detalle">{t.descripcion}</p>
                  )}
                  <div className="ahorr-historial-item__acciones">
                    <Button
                      variant="ghost"
                      size="small"
                      aria-label={`Editar ${t.categoria} del ${t.fecha}`}
                      onClick={() => history.push(`/movimiento?editar=${encodeURIComponent(t.id)}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      aria-label={`Eliminar ${t.categoria} del ${t.fecha}`}
                      onClick={() => setAEliminar(t)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <IonAlert
          isOpen={Boolean(aEliminar)}
          header="Eliminar movimiento"
          message={
            aEliminar
              ? `¿Eliminar ${ETIQUETAS_TIPO[aEliminar.tipo].toLowerCase()} de ${aEliminar.categoria} por ${formatCurrency(aEliminar.monto)} del ${aEliminar.fecha}?`
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
