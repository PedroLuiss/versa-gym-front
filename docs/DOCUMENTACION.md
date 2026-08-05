# Documentación del Proyecto: Versa Gym Frontend (`versa-gym-front`)

Plataforma Web SaaS y Portal de Gestión para **Versa Gym**, desarrollada con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS**.

---

## 1. Visión General del Sistema

**Versa Gym Frontend** proporciona una experiencia de usuario fluida para:
- **Visitantes**: Landing Page informativa con catálogo dinámico de planes SaaS.
- **Dueños de Gimnasios**: Registro con periodo de prueba de 30 días, banner explicativo de prueba al descargar la app para PC, indicador del plan activo en el Dashboard, consulta de cuentas oficiales VersaGym para realizar transferencias, gestión de la suscripción SaaS, copia de la clave de licencia y consulta de respaldos remotos.
- **Super Administradores**: Panel de administración exclusivo (`/admin`) para la gestión de planes SaaS, administración de cuentas bancarias y métodos de pago oficiales de la empresa, revisión/aprobación de pagos de suscripciones y monitoreo de gimnasios.
- **Clientes del Gimnasio (Alumnos)**: Portal web móvil público (`/reportar-pago/:token`) para reportar pagos de cuotas adjuntando comprobantes, procesados posteriormente en la aplicación de escritorio.

---

## 2. Arquitectura del Frontend

El proyecto está diseñado siguiendo una arquitectura modular por capas basada en componentes y custom hooks:

```
[ Componentes / Vistas ] ➔ [ Custom Hooks ] ➔ [ Zustand Store / React Query ] ➔ [ API Service (Axios) ]
```

### Capas Principales:

1. **Vistas y Páginas (`src/pages/`)**:
   - `Home.tsx`: Landing Page pública con héroe, matriz de características y planes.
   - `auth/Login.tsx` y `Register.tsx`: Formularios de autenticación con feedback de errores.
   - `PublicMemberPayment.tsx`: Vista pública responsiva sin navbar/sidebar en `/reportar-pago/:token` para que los alumnos reporten transferencias.
   - `dashboard/Overview.tsx`: Resumen de estado de licencia, banner con aviso de 30 días gratis de prueba para usuarios nuevos, visualización del plan activo, fecha de vencimiento (`end_date`), contador dinámico de días restantes y botón de copia rápida de la `license_key`.
   - `dashboard/Subscription.tsx`: Catálogo de planes SaaS, carga dinámica de cuentas oficiales VersaGym e historial de pagos aislado por usuario.
   - `dashboard/Backups.tsx`: Listado de archivos de respaldo `.sqlite` almacenados en la nube.
   - **Administración Super Admin (`src/pages/admin/`)**:
     - `AdminDashboard.tsx`: Métricas globales del sistema SaaS.
     - `AdminPlans.tsx`: CRUD de planes de suscripción.
     - `AdminPayments.tsx`: Verificación y aprobación/rechazo de comprobantes de pago SaaS.
     - `AdminGymOwners.tsx`: Directorio de dueños de gimnasios y estado de vinculación PC.
     - `AdminCompanyPaymentSettings.tsx`: Configuración de datos de cuentas bancarias, Zelle y Pago Móvil de VersaGym.

2. **Gestión de Estado (`src/store/`)**:
   - `authStore.ts`: Almacena el token Bearer, los datos del usuario y la suscripción actual. Persiste en `localStorage` mediante middleware Zustand `persist`.
   - `uiStore.ts`: Maneja las notificaciones dinámicas tipo Toast y estados globales de modales.

3. **Manejo de Peticiones, Caché & Aislamiento por Usuario (`src/api/` y `src/hooks/`)**:
   - `axios.ts`: Instancia global de Axios configurada con `baseURL` dinámica y un interceptor que inyecta automáticamente el token `Authorization: Bearer <TOKEN>`.
   - `useAuth.ts`: Custom hook que envuelve Login, Registro y Logout con limpieza total de memoria de React Query (`queryClient.clear()`) para prevenir mezclas de historial de pagos entre usuarios.
   - `useSubscription.ts`: Custom hook que gestiona la carga de planes, estado de la suscripción e historial de pagos aislados por ID de usuario (`queryKey: ['payments-history', user?.id]`).
   - `useAdmin.ts`: Custom hook para operaciones del Super Admin (planes, métricas, gimnasios y datos bancarios oficiales).
   - `useMemberPayments.ts`: Custom hook para la recepción de comprobantes de alumnos.
   - `useBackups.ts`: Custom hook para la recuperación de la lista de copias de seguridad.

---

## 3. Integración con la API Central (`versa-gym-back`)

| Servicio Frontend | Endpoint Backend | Descripción |
| :--- | :--- | :--- |
| `authApi.login` | `POST /api/login` | Inicia sesión y extrae `access_token` y objeto `user`. |
| `authApi.register` | `POST /api/register` | Registra usuario e inicia prueba de 30 días. |
| `authApi.me` | `GET /api/user` / `GET /api/me` | Obtiene el perfil actualizado y suscripción. |
| `subscriptionApi.getPlans` | `GET /api/saas-plans` | Recupera los planes activos. |
| `subscriptionApi.getCurrentSubscription` | `GET /api/subscription` | Obtiene el estado, vigencia, días restantes y plan activo de la suscripción. |
| `adminApi.getPublicCompanyPaymentMethods` | `GET /api/company-payment-methods` | Recupera cuentas de cobro oficiales de VersaGym para mostrar al dueño al pagar. |
| `paymentApi.reportPayment` | `POST /api/payments/request` | Envía el formulario `FormData` con `saas_plan_id` y `voucher` SaaS. |
| `paymentApi.getPayments` | `GET /api/payments` | Recupera el historial de pagos de suscripción del gimnasio autenticado. |
| `memberPaymentApi.getPublicInfo` | `GET /api/payment-info/{token}` | Obtiene información básica del gimnasio por su token público. |
| `memberPaymentApi.reportPayment` | `POST /api/report-payment` | Envía comprobante de pago de un alumno. |
| `adminApi.getCompanyPaymentMethods` | `GET /api/admin/company-payment-methods` | Lista todas las cuentas bancarias configuradas de la empresa. |
| `adminApi.createCompanyPaymentMethod` | `POST /api/admin/company-payment-methods` | Crea una nueva cuenta bancaria/Zelle/Pago Móvil. |
| `adminApi.updateCompanyPaymentMethod` | `PUT /api/admin/company-payment-methods/{id}` | Actualiza datos de una cuenta bancaria de la empresa. |
| `adminApi.deleteCompanyPaymentMethod` | `DELETE /api/admin/company-payment-methods/{id}` | Elimina una cuenta bancaria de la empresa. |
| `adminApi.getDashboardMetrics` | `GET /api/admin/dashboard` | Obtiene estadísticas del panel de administración. |
| `adminApi.getPayments` | `GET /api/admin/payments` | Lista pagos SaaS pendientes de revisión. |
| `adminApi.approvePayment` | `POST /api/admin/payments/{id}/approve` | Aprueba pago SaaS y activa/renueva licencia. |
| `backupApi.getBackups` | `GET /api/backups` | Recupera las copias de seguridad de la base de datos local. |

---

## 4. Normalización y Manejo Defensivo de Datos

Para prevenir errores de ejecución (`TypeError`), el frontend implementa fallbacks defensivos en los componentes:
* **Lectura de Planes (`Subscription.tsx`)**:
  ```tsx
  const billingCycle = plan.billing_cycle || (plan.duration_days ? `${plan.duration_days} DÍAS` : 'MENSUAL');
  const isActive = plan.is_active ?? (plan as any).active ?? true;
  ```
* **Interfaces Tipadas (`types/index.ts`)**:
  - `User`: Incluye propiedad opcional `status?: SubscriptionStatus;`.
  - `SaasSubscription`: Incluye `days_left`, `start_date`, `end_date`, `trial_ends_at` y `plan`.
* **Manejo de Arreglos**: Las funciones en `api/` validan si la respuesta viene directamente en la raíz del objeto o dentro de `data` (`Array.isArray(res.data) ? res.data : res.data.data`).

---

## 5. Comandos de Desarrollo

```bash
# Instalación de dependencias:
npm install

# Iniciar servidor local:
npm run dev

# Validar tipos de TypeScript y generar bundle de producción:
npm run build
```
