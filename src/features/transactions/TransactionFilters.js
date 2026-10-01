export const ORDENES = ['fecha-desc', 'fecha-asc', 'monto-desc', 'monto-asc'];

function montoNumerico(monto) {
  const numero = Number(monto);
  return Number.isFinite(numero) ? numero : 0;
}

function textoNormalizado(valor) {
  return typeof valor === 'string' ? valor.toLowerCase() : '';
}

export function buscarTransacciones(transacciones, texto) {
  const lista = Array.isArray(transacciones) ? transacciones : [];
  const consulta = textoNormalizado(texto).trim();
  if (!consulta) return [...lista];

  return lista.filter((t) =>
    [t.categoria, t.descripcion, t.metodoPago, t.fecha].some((campo) =>
      textoNormalizado(campo).includes(consulta)
    )
  );
}

export function filtrarTransacciones(transacciones, filtros = {}) {
  const lista = Array.isArray(transacciones) ? transacciones : [];
  const { tipo = '', categoria = '', desde = '', hasta = '' } = filtros;

  return lista.filter(
    (t) =>
      (!tipo || t.tipo === tipo) &&
      (!categoria || t.categoria === categoria) &&
      (!desde || (t.fecha || '') >= desde) &&
      (!hasta || (t.fecha || '') <= hasta)
  );
}

export function ordenarTransacciones(transacciones, criterio = 'fecha-desc') {
  const lista = Array.isArray(transacciones) ? [...transacciones] : [];
  const porFechaDesc = (a, b) => (b.fecha || '').localeCompare(a.fecha || '');
  const porFechaAsc = (a, b) => (a.fecha || '').localeCompare(b.fecha || '');
  const porMontoDesc = (a, b) => montoNumerico(b.monto) - montoNumerico(a.monto);
  const porMontoAsc = (a, b) => montoNumerico(a.monto) - montoNumerico(b.monto);

  switch (criterio) {
    case 'fecha-asc':
      return lista.sort(porFechaAsc);
    case 'monto-desc':
      return lista.sort(porMontoDesc);
    case 'monto-asc':
      return lista.sort(porMontoAsc);
    default:
      return lista.sort(porFechaDesc);
  }
}

export function aplicarFiltros(transacciones, filtros = {}) {
  const filtrada = filtrarTransacciones(
    buscarTransacciones(transacciones, filtros.texto),
    filtros
  );
  return ordenarTransacciones(filtrada, filtros.orden);
}
