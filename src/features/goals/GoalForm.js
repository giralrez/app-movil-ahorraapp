import React, { useState } from 'react';
import { AmountInput, Button, Input } from '../../components/ui';
import { cadenaFecha } from '../../utils/dates';

export default function GoalForm({ inicial = null, onGuardar, onCancelar }) {
  const hoy = cadenaFecha(new Date());
  const [nombre, setNombre] = useState(inicial ? inicial.nombre : '');
  const [montoObjetivo, setMontoObjetivo] = useState(
    inicial ? String(inicial.montoObjetivo) : ''
  );
  const [fechaLimite, setFechaLimite] = useState(
    inicial ? inicial.fechaLimite || '' : ''
  );
  const [errorNombre, setErrorNombre] = useState('');
  const [errorMonto, setErrorMonto] = useState('');
  const [errorFecha, setErrorFecha] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const guardar = (evento) => {
    evento.preventDefault();

    if (!nombre.trim()) {
      setErrorNombre('Ingresa un nombre para la meta');
      return;
    }

    const numero = Number(montoObjetivo);
    if (!montoObjetivo || !Number.isFinite(numero) || numero <= 0) {
      setErrorMonto('Ingresa un objetivo mayor a cero');
      return;
    }

    if (fechaLimite && !/^\d{4}-\d{2}-\d{2}$/.test(fechaLimite)) {
      setErrorFecha('Ingresa una fecha válida');
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      montoObjetivo: numero,
      fechaLimite: fechaLimite || null
    };

    const resultado = onGuardar(datos);
    if (!resultado.ok) {
      setErrorForm(resultado.error);
      return;
    }

    setErrorNombre('');
    setErrorMonto('');
    setErrorFecha('');
    setErrorForm('');
    if (!inicial) {
      setNombre('');
      setMontoObjetivo('');
      setFechaLimite('');
    }
  };

  return (
    <form
      className="ahorr-card form-card"
      onSubmit={guardar}
      aria-label="Formulario de meta de ahorro"
    >
      <h3 className="ahorr-card__titulo">
        {inicial ? `Editar “${inicial.nombre}”` : 'Nueva meta'}
      </h3>

      <Input
        label="Nombre"
        id="meta-nombre"
        type="text"
        maxLength={60}
        placeholder="Ej. Viaje de fin de año"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value);
          if (errorNombre) setErrorNombre('');
          if (errorForm) setErrorForm('');
        }}
        error={errorNombre}
      />

      <AmountInput
        label="Monto objetivo"
        id="meta-objetivo"
        value={montoObjetivo}
        onChange={(valor) => {
          setMontoObjetivo(valor);
          if (errorMonto) setErrorMonto('');
          if (errorForm) setErrorForm('');
        }}
        error={errorMonto}
      />

      <Input
        label="Fecha límite (opcional)"
        id="meta-fecha"
        type="date"
        min={hoy}
        value={fechaLimite}
        onChange={(e) => {
          setFechaLimite(e.target.value);
          if (errorFecha) setErrorFecha('');
        }}
        error={errorFecha}
      />

      {errorForm && (
        <p className="ahorr-field__message ahorr-field__message--error" role="alert">
          ⚠ {errorForm}
        </p>
      )}

      <Button type="submit" variant="primary" block>
        {inicial ? 'Guardar cambios' : 'Crear meta'}
      </Button>
      <div className="ahorr-empty-acciones">
        <Button type="button" variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
