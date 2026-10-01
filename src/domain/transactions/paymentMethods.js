export const METODOS_PAGO = [
  'Efectivo',
  'Tarjeta de débito',
  'Tarjeta de crédito',
  'Transferencia',
  'Nequi/Daviplata',
  'Otro'
];

export function esMetodoPagoValido(metodo) {
  return (
    typeof metodo === 'string' && (metodo === '' || METODOS_PAGO.includes(metodo))
  );
}
