import {
  leerUsuario,
  escribirUsuario,
  leerTransacciones,
  escribirTransacciones,
  leerPresupuestos,
  escribirPresupuestos,
  leerMetas,
  escribirMetas
} from './localStorageAdapter';

export function getUsuario() {
  return leerUsuario();
}

export function setUsuario(nombre) {
  escribirUsuario(nombre);
}

export function getTransacciones() {
  return leerTransacciones();
}

export function setTransacciones(lista) {
  escribirTransacciones(lista);
}

export function getPresupuestos() {
  return leerPresupuestos();
}

export function setPresupuestos(lista) {
  escribirPresupuestos(lista);
}

export function getMetas() {
  return leerMetas();
}

export function setMetas(lista) {
  escribirMetas(lista);
}