import React, { useState } from 'react';
import { CATEGORIAS_GASTO } from '../../domain/transactions';
import { PERIODOS_PRESUPUESTO } from '../../domain/budgets';
import { AmountInput, Button, Input, Select } from '../../components/ui';

const ETIQUETAS_PERIODO = { mensual: 'Mensual', semanal: 'Semanal', anual: 'Anual' };
const CATEGORIA_TODAS = 'Todas las categorías';

export default function BudgetForm({ inicial = null, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(inicial ? inicial.nombre : '');
  const [categoria, setCategoria] = useState(inicial ? inicial.categoria || '' : '');
  const [montoLimite, setMontoLimite] = useState(
    inicial ? String(inicial.montoLimite) : ''
  );
  const [periodo, setPeriodo] = useState(inicial ? inicial.periodo : 'mensual');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorMonto, setErrorMonto] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const guardar = (evento) => {
    evento.preventDefault();

    if (!nombre.trim()) {
      setErrorNombre('Ingresa un nombre para el presupuesto');
      return;
    }

    const numero = Number(montoLimite);
    if (!montoLimite || !Number.isFinite(numero) || numero <= 0) {
      setErrorMonto('Ingresa un límite mayor a cero');
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      categoria: categoria || null,
      montoLimite: numero,
      periodo
    };

    const resultado = onGuardar(datos);
    if (!resultado.ok) {
      setErrorForm(resultado.error);
      return;
    }

    setErrorNombre('');
    setErrorMonto('');
    setErrorForm('');
    if (!inicial) {
      setNombre('');
      setCategoria('');
      setMontoLimite('');
      setPeriodo('mensual');
    }
  };

  return (
    <form
      className="ahorr-card form-card"
      onSubmit={guardar}
      aria-label="Formulario de presupuesto"
    >
      <h3 className="ahorr-card__titulo">
        {inicial ? `Editar “${inicial.nombre}”` : 'Nuevo presupuesto'}
      </h3>

      <Input
        label="Nombre"
        id="presupuesto-nombre"
        type="text"
        maxLength={60}
        placeholder="Ej. Comida del mes"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value);
          if (errorNombre) setErrorNombre('');
          if (errorForm) setErrorForm('');
        }}
        error={errorNombre}
      />

      <Select
        label="Categoría"
        id="presupuesto-categoria"
        options={[CATEGORIA_TODAS, ...CATEGORIAS_GASTO]}
        value={categoria || CATEGORIA_TODAS}
        onChange={(e) =>
          setCategoria(e.target.value === CATEGORIA_TODAS ? '' : e.target.value)
        }
      />

      <AmountInput
        label="Límite"
        id="presupuesto-limite"
        value={montoLimite}
        onChange={(valor) => {
          setMontoLimite(valor);
          if (errorMonto) setErrorMonto('');
          if (errorForm) setErrorForm('');
        }}
        error={errorMonto}
      />

      <Select
        label="Período"
        id="presupuesto-periodo"
        options={PERIODOS_PRESUPUESTO.map((p) => ETIQUETAS_PERIODO[p])}
        value={ETIQUETAS_PERIODO[periodo]}
        onChange={(e) => {
          const seleccionado = PERIODOS_PRESUPUESTO.find(
            (p) => ETIQUETAS_PERIODO[p] === e.target.value
          );
          setPeriodo(seleccionado || 'mensual');
        }}
      />

      {errorForm && (
        <p className="ahorr-field__message ahorr-field__message--error" role="alert">
          ⚠ {errorForm}
        </p>
      )}

      <Button type="submit" variant="primary" block>
        {inicial ? 'Guardar cambios' : 'Crear presupuesto'}
      </Button>
      <div className="ahorr-empty-acciones">
        <Button type="button" variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
