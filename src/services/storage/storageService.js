import {
  leerUsuario,
  escribirUsuario,
  leerTransacciones,
  escribirTransacciones
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