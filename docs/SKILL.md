---
name: versa-gym-front-guide
description: Guía de referencia y arquitectura para el Frontend de VersaGym (Landing Page + Panel de Control del Dueño) desarrollado en React, Vite, TypeScript, Tailwind CSS y Zustand.
---

# Skill: Versa Gym Frontend (`versa-gym-front`)

Esta guía define las especificaciones, la estructura de carpetas, los estándares de diseño y los flujos de integración con el Backend Laravel 12 para la plataforma web de **VersaGym**.

---

## 🛠️ Stack Tecnológico

| Tecnología | Descripción / Propósito |
| :--- | :--- |
| **React 18+ & Vite** | Framework frontend ligero y ultra rápido para renderizado client-side (SPA). |
| **TypeScript** | Tipado estricto alineado con los modelos de datos de Laravel (DTOs / Interfaces). |
| **Tailwind CSS** | Estilos utilitarios modernos con soporte para tema oscuro (`Zinc-900`) y acento vibrante (`Emerald-500` / `Indigo-600`). |
| **Zustand** | Gestión de estado global ligera para sesión (`authStore`), persistencia de tokens y licencias. |
| **Axios + TanStack Query (React Query)** | Cliente HTTP con interceptores Bearer token y caché/sincronización remota. |
| **React Hook Form + Zod** | Gestión y validación de formularios sincronizada con las reglas del Backend. |
| **Lucide React** | Librería de iconografía moderna y ligera. |

---

## 🏗️ Arquitectura y Estructura de Carpetas

```
src/
├── api/              # Cliente Axios con interceptores y servicios de API (/auth, /subscription, /payments, /backups)
├── components/       # Componentes reutilizables de UI (Botones, Inputs, Cards, Badges, Modales, Skeletons)
├── hooks/            # Hooks personalizados (useAuth, useSubscription, useBackups)
├── layouts/          # Plantillas de diseño (PublicLayout, DashboardLayout, AuthLayout)
├── pages/            # Páginas y vistas (Home, Login, Register, Subscription, Dashboard, Backups)
├── store/            # Tiendas de Zustand (authStore.ts, uiStore.ts)
├── types/            # Interfaces de TypeScript sincronizadas con Backend (User, SaasPlan, SaasSubscription, SaasPayment, Backup)
└── utils/            # Utilities (formateadores de fecha, moneda, helpers de clipboard)
```

---

## 🗺️ Mapa de Vistas (User Experience)

### 1. Zona Pública (Landing Page & Auth)
- **Home (`pages/Home.tsx`)**: Hero section con propuesta de valor, matriz de características y tabla de precios interactiva consumiendo `GET /api/saas-plans`.
- **Login (`pages/auth/Login.tsx`)**: Formulario de autenticación para dueños de gimnasio (`POST /api/login`).
- **Register (`pages/auth/Register.tsx`)**: Registro de nuevo dueño (`POST /api/register`) que inicia automáticamente el periodo de prueba (Trial de 30 días).

### 2. Zona Privada (Dashboard del Dueño)
- **Panel de Inicio (`pages/dashboard/Overview.tsx`)**:
  - Visualización destacada de la `license_key` con botón de copia con un clic.
  - Indicador dinámico de días restantes de prueba / suscripción activa.
  - Botón prominente de descarga de la aplicación ejecutable ("Descargar VersaGym para PC").
- **Gestión de Suscripción (`pages/dashboard/Subscription.tsx`)**:
  - Catálogo de planes SaaS disponibles (`GET /api/saas-plans`).
  - Modal / Formulario para **Reportar Pago** (`POST /api/payments/request`) adjuntando comprobante y número de referencia.
  - Historial detallado de pagos con estado (`pending`, `approved`, `rejected`).
- **Mis Backups (`pages/dashboard/Backups.tsx`)**:
  - Listado de copias de seguridad subidas automáticamente por la app Desktop (`GET /api/backups`).

---

## ⚡ Integración con Backend Laravel (Puntos Clave)

### A. Tipado Sincronizado (`src/types/`)
Interfaces exactas que mapean la respuesta de Laravel:
- `SaasSubscription`: `license_key`, `status` (`'active' | 'pending' | 'expired' | 'trial'`), `starts_at`, `ends_at`, `trial_days_left`.
- `User`: `id`, `name`, `email`, `role` (`'gym_owner' | 'super_admin'`).
- `SaasPayment`: `id`, `amount`, `payment_method`, `reference_number`, `proof_url`, `status`.

### B. Gestión de Sesión & Interceptores
- `authStore` de Zustand persiste `token` y `user` en `localStorage`.
- `api/axios.ts` intercepta peticiones inyectando el header `Authorization: Bearer <token>`.
- Manejo centralizado de errores 401 (redirección a login e invalidación de token).

### C. Flujo de Reporte de Pago Manual
1. El usuario consulta los planes y los datos bancarios del Super Admin.
2. Selecciona un plan y carga la captura + referencia.
3. Se realiza el envío con `multipart/form-data` a `POST /api/payments/request`.
4. La UI refleja el estado `Esperando aprobación por el administrador`.

---

## 🎨 Guía de Estilos y UI (Tailwind CSS)

- **Fondo Base (Dark Theme)**: `Zinc-900` / `Zinc-950` para interfaces profesionales y modernas.
- **Acento Principal**: `Emerald-500` (vitalidad/gimnasio) o `Indigo-600` (elegancia SaaS).
- **Feedback Visual**: Implementación de Skeleton loaders durante la resolución de peticiones a la API.
