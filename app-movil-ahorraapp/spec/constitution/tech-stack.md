# Ahorrapp — Tech Stack

## 1. Stack actual

La aplicación utiliza:

- React 18
- Ionic React 6
- JavaScript
- React Router 5
- Chart.js
- Ionicons
- Create React App
- CSS

## 2. Decisión arquitectónica

La refactorización mantendrá inicialmente:

- React;
- Ionic React;
- JavaScript;
- Chart.js.

No se realizará una migración tecnológica simultánea a la refactorización funcional.

La prioridad es estabilizar arquitectura y UX antes de cambiar el stack.

## 3. Arquitectura objetivo

La aplicación deberá evolucionar hacia una separación por responsabilidades:

```text
src/
├── app/
│   ├── App.js
│   └── routes/
│
├── components/
│   ├── ui/
│   ├── financial/
│   └── charts/
│
├── features/
│   ├── transactions/
│   ├── dashboard/
│   ├── budgets/
│   ├── goals/
│   └── financial-health/
│
├── domain/
│   ├── transactions/
│   ├── budgets/
│   └── goals/
│
├── services/
│   └── storage/
│
├── hooks/
│
├── utils/
│
├── theme/
│
└── pages/