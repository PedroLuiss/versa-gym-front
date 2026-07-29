import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { authApi, LoginPayload, RegisterPayload } from '../api/authApi';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const { setAuth, logout: clearAuth, user, subscription, isAuthenticated } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user, data.subscription);
      addToast('success', `¡Bienvenido de nuevo, ${data.user.name}!`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Credenciales inválidas. Por favor intenta de nuevo.';
      addToast('error', msg);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user, data.subscription);
      addToast('success', '¡Cuenta creada con éxito! Tu prueba gratuita de 30 días ha comenzado.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Ocurrió un error al registrar tu cuenta.';
      addToast('error', msg);
    },
  });

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignorar errores de logout en API y limpiar localmente
    } finally {
      clearAuth();
      addToast('info', 'Sesión cerrada correctamente.');
    }
  };

  return {
    user,
    subscription,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
