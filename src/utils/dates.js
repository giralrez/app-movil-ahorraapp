export function aFechaLocal(fecha) {
  if (fecha instanceof Date) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }
  const [anio, mes, dia] = String(fecha).split('-').map(Number);
  return new Date(anio, (mes || 1) - 1, dia || 1);
}

export function cadenaFecha(fecha) {
  const f = aFechaLocal(fecha);
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const dia = String(f.getDate()).padStart(2, '0');
  return `${f.getFullYear()}-${mes}-${dia}`;
}
