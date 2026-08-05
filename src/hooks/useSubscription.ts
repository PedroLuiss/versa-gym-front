import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscriptionApi';
import { paymentApi, PaymentReportFormData } from '../api/paymentApi';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const useSubscription = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const { user, setSubscription } = useAuthStore();

  const plansQuery = useQuery({
    queryKey: ['saas-plans'],
    queryFn: subscriptionApi.getPlans,
  });

  const currentSubscriptionQuery = useQuery({
    queryKey: ['current-subscription', user?.id],
    queryFn: async () => {
      const sub = await subscriptionApi.getCurrentSubscription();
      if (sub) setSubscription(sub);
      return sub;
    },
    enabled: !!user,
  });

  const paymentsQuery = useQuery({
    queryKey: ['payments-history', user?.id],
    queryFn: paymentApi.getPayments,
    enabled: !!user,
  });

  const reportPaymentMutation = useMutation({
    mutationFn: (data: PaymentReportFormData) => paymentApi.reportPayment(data),
    onSuccess: () => {
      addToast('success', '¡Reporte de pago enviado con éxito! En espera de validación.');
      queryClient.invalidateQueries({ queryKey: ['payments-history', user?.id] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Error al enviar el comprobante de pago.';
      addToast('error', msg);
    },
  });

  return {
    plans: plansQuery.data || [],
    isLoadingPlans: plansQuery.isLoading,
    subscription: currentSubscriptionQuery.data,
    isLoadingSubscription: currentSubscriptionQuery.isLoading,
    payments: paymentsQuery.data || [],
    isLoadingPayments: paymentsQuery.isLoading,
    reportPayment: reportPaymentMutation.mutateAsync,
    isReportingPayment: reportPaymentMutation.isPending,
  };
};
