import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, CreatePlanPayload, CompanyPaymentMethodPayload } from '../api/adminApi';
import { useUIStore } from '../store/uiStore';

export const useAdmin = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  // Metrics Query
  const metricsQuery = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: adminApi.getDashboardMetrics,
  });

  // Plans Query
  const plansQuery = useQuery({
    queryKey: ['admin-plans'],
    queryFn: adminApi.getPlans,
  });

  // Payments Query
  const paymentsQuery = useQuery({
    queryKey: ['admin-payments'],
    queryFn: () => adminApi.getPayments(),
  });

  // Gym Owners Query
  const gymOwnersQuery = useQuery({
    queryKey: ['admin-gym-owners'],
    queryFn: () => adminApi.getGymOwners(),
  });

  // Company Payment Methods Query
  const companyPaymentMethodsQuery = useQuery({
    queryKey: ['admin-company-payment-methods'],
    queryFn: adminApi.getCompanyPaymentMethods,
  });

  // Create Plan Mutation
  const createPlanMutation = useMutation({
    mutationFn: (payload: CreatePlanPayload) => adminApi.createPlan(payload),
    onSuccess: () => {
      addToast('success', 'Plan SaaS creado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al crear el plan.');
    },
  });

  // Update Plan Mutation
  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePlanPayload> }) =>
      adminApi.updatePlan(id, data),
    onSuccess: () => {
      addToast('success', 'Plan SaaS actualizado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al actualizar el plan.');
    },
  });

  // Delete Plan Mutation
  const deletePlanMutation = useMutation({
    mutationFn: (id: number) => adminApi.deletePlan(id),
    onSuccess: () => {
      addToast('success', 'Plan SaaS desactivado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al desactivar el plan.');
    },
  });

  // Company Payment Methods Mutations
  const createCompanyPaymentMethodMutation = useMutation({
    mutationFn: (payload: CompanyPaymentMethodPayload) => adminApi.createCompanyPaymentMethod(payload),
    onSuccess: () => {
      addToast('success', 'Cuenta / Método de pago creado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['admin-company-payment-methods'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al crear la cuenta de pago.');
    },
  });

  const updateCompanyPaymentMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CompanyPaymentMethodPayload> }) =>
      adminApi.updateCompanyPaymentMethod(id, data),
    onSuccess: () => {
      addToast('success', 'Cuenta de pago actualizada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['admin-company-payment-methods'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al actualizar la cuenta de pago.');
    },
  });

  const deleteCompanyPaymentMethodMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCompanyPaymentMethod(id),
    onSuccess: () => {
      addToast('info', 'Cuenta de pago eliminada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['admin-company-payment-methods'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al eliminar la cuenta de pago.');
    },
  });

  // Approve Payment Mutation
  const approvePaymentMutation = useMutation({
    mutationFn: (id: number) => adminApi.approvePayment(id),
    onSuccess: (res) => {
      addToast('success', res.message || 'Pago aprobado y suscripción activada.');
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-gym-owners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al aprobar el pago.');
    },
  });

  // Reject Payment Mutation
  const rejectPaymentMutation = useMutation({
    mutationFn: (id: number) => adminApi.rejectPayment(id),
    onSuccess: (res) => {
      addToast('info', res.message || 'Pago rechazado.');
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Error al rechazar el pago.');
    },
  });

  return {
    metrics: metricsQuery.data,
    isLoadingMetrics: metricsQuery.isLoading,
    plans: plansQuery.data || [],
    isLoadingPlans: plansQuery.isLoading,
    payments: paymentsQuery.data || [],
    isLoadingPayments: paymentsQuery.isLoading,
    gymOwners: gymOwnersQuery.data || [],
    isLoadingGymOwners: gymOwnersQuery.isLoading,
    companyPaymentMethods: companyPaymentMethodsQuery.data || [],
    isLoadingCompanyPaymentMethods: companyPaymentMethodsQuery.isLoading,

    createPlan: createPlanMutation.mutateAsync,
    isCreatingPlan: createPlanMutation.isPending,
    updatePlan: updatePlanMutation.mutateAsync,
    isUpdatingPlan: updatePlanMutation.isPending,
    deletePlan: deletePlanMutation.mutateAsync,

    createCompanyPaymentMethod: createCompanyPaymentMethodMutation.mutateAsync,
    isCreatingCompanyPaymentMethod: createCompanyPaymentMethodMutation.isPending,
    updateCompanyPaymentMethod: updateCompanyPaymentMethodMutation.mutateAsync,
    isUpdatingCompanyPaymentMethod: updateCompanyPaymentMethodMutation.isPending,
    deleteCompanyPaymentMethod: deleteCompanyPaymentMethodMutation.mutateAsync,

    approvePayment: approvePaymentMutation.mutateAsync,
    isApprovingPayment: approvePaymentMutation.isPending,
    rejectPayment: rejectPaymentMutation.mutateAsync,
    isRejectingPayment: rejectPaymentMutation.isPending,

    refetchAll: () => {
      metricsQuery.refetch();
      plansQuery.refetch();
      paymentsQuery.refetch();
      gymOwnersQuery.refetch();
      companyPaymentMethodsQuery.refetch();
    },
  };
};
