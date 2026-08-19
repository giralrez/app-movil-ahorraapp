# Ahorrapp — Mission

## 1. Propósito

Ahorrapp es una aplicación móvil para Android orientada al control y comprensión de las finanzas personales.

La aplicación debe permitir al usuario registrar sus movimientos financieros, conocer su situación económica actual, controlar presupuestos, establecer metas de ahorro y comprender sus hábitos mediante indicadores y visualizaciones.

El objetivo no es únicamente registrar gastos, sino transformar los datos financieros personales en información accionable.

## 2. Usuario objetivo

El usuario principal es una persona que desea:

- controlar sus ingresos y gastos;
- conocer cuánto dinero tiene disponible;
- entender en qué categorías consume más;
- establecer límites de gasto;
- crear metas de ahorro;
- medir su progreso financiero;
- mejorar sus hábitos financieros.

## 3. Principios del producto

### Simplicidad

Registrar una transacción debe requerir el menor número posible de interacciones.

### Visibilidad

La información financiera importante debe estar disponible rápidamente desde el dashboard.

### Accionabilidad

Los datos deben convertirse en indicadores que permitan tomar decisiones.

### Privacidad

Los datos financieros pertenecen al usuario y deben tratarse como información sensible.

### Offline-first

Las funciones fundamentales deben funcionar sin conexión a Internet.

### Consistencia

La interfaz debe utilizar componentes, patrones visuales y reglas de interacción consistentes.

### Evolución incremental

La arquitectura debe permitir agregar nuevas funcionalidades sin introducir acoplamiento innecesario.

## 4. Alcance

La aplicación incluirá:

- dashboard financiero;
- ingresos;
- gastos;
- categorías;
- métodos de pago;
- presupuestos;
- metas de ahorro;
- indicadores financieros;
- gráficos;
- historial de transacciones;
- configuración;
- persistencia local;
- validación de datos;
- manejo de estados vacíos y errores.

## 5. Fuera del alcance inicial

No se implementará inicialmente:

- conexión directa con bancos;
- scraping bancario;
- transferencias;
- pagos;
- trading;
- productos financieros;
- backend obligatorio;
- sincronización multiusuario.

## 6. Criterio de éxito

Ahorrapp será considerada exitosa cuando un usuario pueda:

1. registrar un ingreso;
2. registrar un gasto;
3. consultar su saldo;
4. conocer cuánto gastó durante el mes;
5. identificar sus principales categorías de gasto;
6. crear un presupuesto;
7. crear una meta de ahorro;
8. consultar su progreso;
9. entender su situación financiera mediante indicadores simples.

## 7. Regla para los agentes

Los agentes de código deberán priorizar:

1. funcionalidad existente;
2. arquitectura;
3. mantenibilidad;
4. UX;
5. accesibilidad;
6. rendimiento;
7. seguridad.

Ninguna nueva funcionalidad debe romper funcionalidades existentes sin que el cambio esté explícitamente documentado en su correspondiente SDD.