---
name: versa-gym-front
description: Guía de referencia y mapa del proyecto Versa Gym Frontend (React 18+, Vite, TypeScript, Tailwind CSS, Zustand, TanStack Query).
---

# Skill: Versa Gym Frontend (`versa-gym-front`)

Esta guía define las especificaciones, la estructura de carpetas, los estándares de diseño y los flujos de integración con el Backend Laravel 12 para la plataforma web de **VersaGym**.

---

## 🛠️ Stack Tecnológico

| Tecnología | Descripción / Propósito |
| :--- | :--- |
| **React 18+ & Vite** | SPA rápida en TypeScript. |
| **Tailwind CSS** | Estilos utilitarios en tema oscuro (`Zinc-900`) con acentos `Emerald-500` / `Indigo-600`. |
| **Zustand** | Estado global para sesión (`authStore`), persistencia de tokens y datos de usuario. |
| **Axios + TanStack Query** | Cliente HTTP con interceptores Bearer Token y sincronización de estado remoto. |
| **React Hook Form + Zod** | Validaciones de formularios sincronizadas con las reglas de Laravel. |
| **Lucide React** | Librería de iconos vectoriales SVG. |

---

## 🏗️ Estructura de Carpetas

- `src/api/`: Cliente Axios (`axios.ts`) e inyección de token Bearer.
- `src/components/`: Componentes modulares UI (Buttons, Cards, Badges, Skeletons, Modals).
- `src/hooks/`: Custom hooks para consumo de queries y mutaciones.
- `src/layouts/`: PublicLayout, DashboardLayout, AuthLayout.
- `src/pages/`: Home, Login, Register, Overview, Subscription, Backups.
- `src/store/`: `authStore.ts` (Zustand).
- `src/types/`: Interfaces de TypeScript mapeando los modelos del backend (`User`, `SaasSubscription`, `SaasPlan`, `SaasPayment`, `Backup`).
- `src/utils/`: Helpers de formateo y manipulaciones varias.
