const CLAVE_USUARIO = 'usuario';
const CLAVE_TRANSACCIONES = 'transacciones';
const CLAVE_PRESUPUESTOS = 'presupuestos';
const CLAVE_METAS = 'metas';

export function leerUsuario() {
  try {
    return localStorage.getItem(CLAVE_USUARIO) || '';
  } catch (error) {
    console.error('Error al leer usuario:', error);
    return '';
  }
}

export function escribirUsuario(nombre) {
  try {
    localStorage.setItem(CLAVE_USUARIO, String(nombre));
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
}

export function leerTransacciones() {
  try {
    const datos = localStorage.getItem(CLAVE_TRANSACCIONES);
    const lista = JSON.parse(datos);
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    console.error('Error al leer transacciones:', error);
    return [];
  }
}

export function escribirTransacciones(lista) {
  try {
    localStorage.setItem(CLAVE_TRANSACCIONES, JSON.stringify(lista || []));
  } catch (error) {
    console.error('Error al guardar transacciones:', error);
  }
}

export function leerPresupuestos() {
  try {
    const datos = localStorage.getItem(CLAVE_PRESUPUESTOS);
    const lista = JSON.parse(datos);
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    console.error('Error al leer presupuestos:', error);
    return [];
  }
}

export function escribirPresupuestos(lista) {
  try {
    localStorage.setItem(CLAVE_PRESUPUESTOS, JSON.stringify(lista || []));
  } catch (error) {
    console.error('Error al guardar presupuestos:', error);
  }
}

export function leerMetas() {
  try {
    const datos = localStorage.getItem(CLAVE_METAS);
    const lista = JSON.parse(datos);
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    console.error('Error al leer metas:', error);
    return [];
  }
}

export function escribirMetas(lista) {
  try {
    localStorage.setItem(CLAVE_METAS, JSON.stringify(lista || []));
  } catch (error) {
    console.error('Error al guardar metas:', error);
  }
}