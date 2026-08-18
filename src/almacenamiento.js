export function guardarUsuario(nombre){ localStorage.setItem('usuario', nombre); }
export function obtenerUsuario(){ return localStorage.getItem('usuario') || ''; }
export function guardarTransacciones(lista){ localStorage.setItem('transacciones', JSON.stringify(lista || [])); }
export function obtenerTransacciones(){ try { return JSON.parse(localStorage.getItem('transacciones')) || []; } catch { return []; } }
