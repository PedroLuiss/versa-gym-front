# ⚡ Versa Gym - Web Frontend (`versa-gym-front`)

Plataforma Web y Portal del Cliente para **Versa Gym**. Desarrollado con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS**.

Esta aplicación cumple tres funciones principales en el ecosistema:
1. **Landing Page Comercial**: Presentación de las funcionalidades del software VersaGym y los planes de suscripción disponibles.
2. **Panel de Control para Gym Owners**: Gestión de cuenta, copia de la clave de licencia (`license_key`), descarga del software ejecutable para PC, reporte de pagos e historial de respaldos en la nube.
3. **Módulo de Pago Móvil para Clientes**: Enlace dinámico para que los clientes del gimnasio puedan reportar sus renovaciones desde su celular sin instalar aplicaciones.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Framework / Build** | React 18 + TypeScript + Vite 8 |
| **Estilos CSS** | Tailwind CSS 3.4 + PostCSS + Autoprefixer |
| **Iconos** | Lucide React |
| **Enrutamiento** | React Router DOM v6 |
| **Estado Global** | Zustand (Persist storage para sesión y UI) |
| **Peticiones HTTP** | Axios con Interceptores de Tokens Bearer |
| **Manejo de Caché** | TanStack React Query v5 |
| **Formularios & Validación** | React Hook Form + Zod |

---

## 📁 Estructura del Proyecto

```text
src/
├── api/             # Integración con la API Backend (authApi, subscriptionApi, paymentApi, backupApi)
├── components/      # Componentes UI reutilizables (Button, Card, Input, Badge, Modal, Toast)
├── hooks/           # Custom React Hooks (useAuth, useSubscription, useBackups)
├── layouts/         # Layouts de la app (PublicLayout, AuthLayout, DashboardLayout)
├── pages/           # Vistas principales (Home, Login, Register, Overview, Subscription, Backups)
├── store/           # Stores Zustand (authStore, uiStore)
├── types/           # Interfaces TypeScript (User, SaasPlan, SaasSubscription, SaasPayment, Backup)
└── utils/           # Utilidades (formatters, clipboard)
```

---

## ⚙️ Instalación y Ejecución

### 1. Requisitos Previos
Tener **Node.js** (v18+) e instalar dependencias:
```bash
npm install
```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz de `versa-gym-front`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Modo Desarrollo
Ejecuta el servidor de desarrollo de Vite:
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:5173` (o `http://localhost:3000`).

### 4. Compilación para Producción
Para verificar tipos de TypeScript y generar la build optimizada:
```bash
npm run build
```

---

## 📄 Documentación Adicional
Para ver la guía completa de la arquitectura frontend, consulta [docs/DOCUMENTACION.md](file:///c:/xampp/htdocs/versa-gym/versa-gym-front/docs/DOCUMENTACION.md).
