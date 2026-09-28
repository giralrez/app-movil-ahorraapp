# 💰 AhorraApp

**Aplicación móvil de control financiero personal**, construida con **Ionic + React + JavaScript**, pensada para llevar el registro de ingresos y gastos y visualizar la salud financiera del usuario de forma simple y rápida.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Stack](https://img.shields.io/badge/stack-Ionic%20%7C%20React%20%7C%20JavaScript-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-lightgrey)

---

## 📱 Descripción

AhorraApp permite a cualquier persona registrar sus **ingresos y gastos** desde el celular o el navegador, y ver de un vistazo su **salud financiera** a través de gráficas interactivas. Todo el almacenamiento funciona de forma local (`localStorage`), por lo que la app puede usarse sin backend ni conexión a internet.

## ✨ Funcionalidades

- 🔐 **Inicio de sesión simple** con nombre de usuario, guardado localmente.
- 📥 **Registro de ingresos** mediante formulario dedicado.
- 📤 **Registro de gastos** mediante formulario dedicado.
- 📊 **Salud Financiera**: vista con totales de ingresos y gastos, alternables con navegación tipo carrusel.
- 📈 **Gráficas dinámicas** (dona) con [Chart.js](https://www.chartjs.org/), que se actualizan en tiempo real según las transacciones registradas.
- 🔎 **Detalle de transacciones** por tipo (ingreso o gasto).
- 💾 **Persistencia local** de usuario y transacciones (sin necesidad de servidor).

## 🛠️ Tecnologías

| Categoría         | Tecnología                          |
|--------------------|--------------------------------------|
| Framework UI       | [Ionic React](https://ionicframework.com/) 6 |
| Librería principal | [React](https://react.dev/) 18       |
| Enrutamiento       | React Router (v5) / Ionic React Router |
| Gráficas           | [Chart.js](https://www.chartjs.org/) 4 |
| Almacenamiento     | `localStorage` (navegador)           |
| Bundler / Scripts  | `react-scripts` 5 (Create React App) |

## 📂 Estructura del proyecto

```
app-movil-ahorraapp/
├── public/
│   ├── imagenes/          # Recursos gráficos (logo, etc.)
│   └── index.html
├── src/
│   ├── paginas/
│   │   ├── Inicio.js              # Login / ingreso de usuario
│   │   ├── Principal.js           # Pantalla principal
│   │   ├── FormularioIngreso.js   # Registro de ingresos
│   │   ├── FormularioGasto.js     # Registro de gastos
│   │   ├── SaludFinanciera.js     # Resumen con gráficas
│   │   └── SaludDetalles.js       # Detalle de transacciones
│   ├── almacenamiento.js  # Lógica de persistencia (localStorage)
│   ├── tema.css           # Estilos globales
│   ├── App.js              # Definición de rutas
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Instalación y uso

### Requisitos previos
- [Node.js](https://nodejs.org/) 18 o superior (recomendado: [v22.21.0](https://nodejs.org/dist/v22.21.0/node-v22.21.0-x64.msi))
- npm (incluido con Node.js)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/giralrez/app-movil-ahorraapp.git
cd app-movil-ahorraapp

# 2. Instalar dependencias
npm install

# 3. Levantar el proyecto en modo desarrollo
npm start
```

La aplicación quedará disponible en [http://localhost:3000](http://localhost:3000).

### Otros scripts disponibles

```bash
npm run build   # Genera la build de producción
npm test        # Ejecuta las pruebas
```

## 🗺️ Rutas de la aplicación

| Ruta                 | Descripción                          |
|----------------------|---------------------------------------|
| `/inicio`            | Pantalla de inicio / login            |
| `/principal`         | Pantalla principal (home)             |
| `/salud`             | Salud financiera (resumen + gráficas) |
| `/salud-detalles`    | Detalle de ingresos o gastos          |
| `/ingreso`           | Formulario de registro de ingreso     |
| `/gasto`             | Formulario de registro de gasto       |

## 📌 Roadmap

- [ ] Empaquetado como app móvil nativa con **Capacitor** (Android/iOS)
- [ ] Migración de almacenamiento local a backend/API
- [ ] Autenticación real de usuarios
- [ ] Filtros y reportes por fecha/categoría
- [ ] Modo oscuro

## 👤 Autor

**Andrés Giraldo Ramírez** ([@giralrez](https://github.com/giralrez))
Software Engineer en transición hacia Data Analytics / Data Engineering.

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Puedes usar, modificar y distribuir el código citando la autoría original.
