import React, { useState } from 'react';
import { AmountInput, Button } from '../../components/ui';
import { formatCurrency } from '../../utils/format';

export default function ContributionForm({ meta, onConfirmar, onCancelar }) {
  const [monto, setMonto] = useState('');
  const [errorMonto, setErrorMonto] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const enviar = (operacion) => {
    const numero = Number(monto);
    if (!monto || !Number.isFinite(numero) || numero <= 0) {
      setErrorMonto('Ingresa un monto mayor a cero');
      return;
    }

    const resultado = onConfirmar(operacion, numero);
    if (!resultado.ok) {
      setErrorForm(resultado.error);
      return;
    }

    setMonto('');
    setErrorMonto('');
    setErrorForm('');
  };

  return (
    <form
      className="ahorr-card form-card"
      onSubmit={(e) => {
        e.preventDefault();
        enviar('aportar');
      }}
      aria-label={`Aportes a la meta ${meta.nombre}`}
    >
      <h3 className="ahorr-card__titulo">Aportar a “{meta.nombre}”</h3>

      <p className="ahorr-card__meta">
        Disponible: {formatCurrency(meta.montoActual || 0)}
      </p>

      <AmountInput
        label="Monto"
        id="aporte-monto"
        value={monto}
        onChange={(valor) => {
          setMonto(valor);
          if (errorMonto) setErrorMonto('');
          if (errorForm) setErrorForm('');
        }}
        error={errorMonto}
      />

      {errorForm && (
        <p className="ahorr-field__message ahorr-field__message--error" role="alert">
          ⚠ {errorForm}
        </p>
      )}

      <Button
        type="submit"
        variant="success"
        block
        aria-label={`Confirmar aporte a la meta ${meta.nombre}`}
      >
        Aportar
      </Button>
      <div className="ahorr-empty-acciones">
        <Button
          type="button"
          variant="expense"
          aria-label={`Confirmar retiro de la meta ${meta.nombre}`}
          onClick={() => enviar('retirar')}
        >
          Retirar
        </Button>
        <Button type="button" variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
