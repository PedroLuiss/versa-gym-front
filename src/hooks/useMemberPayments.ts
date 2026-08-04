import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberPaymentApi } from '../api/memberPaymentApi';
import { useUIStore } from '../store/uiStore';

export const useMemberPayments = (statusFilter?: string) => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  const memberPaymentsQuery = useQuery({
    queryKey: ['member-payments', statusFilter],
    queryFn: () => memberPaymentApi.getPayments(statusFilter),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => memberPaymentApi.approvePayment(id),
    onSuccess: () => {
      addToast('success', '¡Pago del alumno aprobado con éxito!');
      queryClient.invalidateQueries({ queryKey: ['member-payments'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Error al aprobar el pago.';
      addToast('error', msg);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => memberPaymentApi.rejectPayment(id, notes),
    onSuccess: () => {
      addToast('info', 'El pago del alumno ha sido rechazado.');
      queryClient.invalidateQueries({ queryKey: ['member-payments'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Error al rechazar el pago.';
      addToast('error', msg);
    },
  });

  return {
    payments: memberPaymentsQuery.data?.payments || [],
    publicToken: memberPaymentsQuery.data?.public_token || '',
    isLoading: memberPaymentsQuery.isLoading,
    approvePayment: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    rejectPayment: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
    refetch: memberPaymentsQuery.refetch,
  };
};
