import { apiClient } from './axios';
import { SaasPlan, SaasPayment, User, CompanyPaymentSetting } from '../types';

export interface AdminDashboardMetrics {
  total_gym_owners: number;
  active_subscriptions: number;
  pending_payments_count: number;
  total_revenue: number;
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  duration_days: number;
  description?: string;
  active?: boolean;
}

export interface CompanyPaymentMethodPayload {
  bank_name: string;
  payment_type: string;
  account_number?: string;
  account_holder: string;
  id_number?: string;
  email_or_phone?: string;
  notes?: string;
  is_active?: boolean;
}

export const adminApi = {
  getDashboardMetrics: async (): Promise<AdminDashboardMetrics> => {
    const res = await apiClient.get<any>('/admin/dashboard');
    const data = res.data;
    return data.data || data;
  },

  getPlans: async (): Promise<SaasPlan[]> => {
    const res = await apiClient.get<any>('/admin/saas-plans');
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  createPlan: async (payload: CreatePlanPayload): Promise<SaasPlan> => {
    const res = await apiClient.post<any>('/admin/saas-plans', payload);
    return res.data.plan || res.data.data || res.data;
  },

  updatePlan: async (id: number, payload: Partial<CreatePlanPayload>): Promise<SaasPlan> => {
    const res = await apiClient.put<any>(`/admin/saas-plans/${id}`, payload);
    return res.data.plan || res.data.data || res.data;
  },

  deletePlan: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/saas-plans/${id}`);
  },

  getPayments: async (status?: string): Promise<SaasPayment[]> => {
    const res = await apiClient.get<any>('/admin/payments', { params: { status } });
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.data)) return data.data.data;
    return [];
  },

  approvePayment: async (id: number): Promise<{ message: string }> => {
    const res = await apiClient.post<any>(`/admin/payments/${id}/approve`);
    return res.data;
  },

  rejectPayment: async (id: number): Promise<{ message: string }> => {
    const res = await apiClient.post<any>(`/admin/payments/${id}/reject`);
    return res.data;
  },

  getGymOwners: async (status?: string): Promise<User[]> => {
    const res = await apiClient.get<any>('/admin/gym-owners', { params: { status } });
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.data)) return data.data.data;
    return [];
  },

  getGymOwner: async (id: number): Promise<User> => {
    const res = await apiClient.get<any>(`/admin/gym-owners/${id}`);
    const data = res.data;
    return data.data || data;
  },

  // Cuentas de Pago Oficiales VersaGym
  getPublicCompanyPaymentMethods: async (): Promise<CompanyPaymentSetting[]> => {
    const res = await apiClient.get<any>('/company-payment-methods');
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  getCompanyPaymentMethods: async (): Promise<CompanyPaymentSetting[]> => {
    const res = await apiClient.get<any>('/admin/company-payment-methods');
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  createCompanyPaymentMethod: async (payload: CompanyPaymentMethodPayload): Promise<CompanyPaymentSetting> => {
    const res = await apiClient.post<any>('/admin/company-payment-methods', payload);
    return res.data.data || res.data;
  },

  updateCompanyPaymentMethod: async (
    id: number,
    payload: Partial<CompanyPaymentMethodPayload>
  ): Promise<CompanyPaymentSetting> => {
    const res = await apiClient.put<any>(`/admin/company-payment-methods/${id}`, payload);
    return res.data.data || res.data;
  },

  deleteCompanyPaymentMethod: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/company-payment-methods/${id}`);
  },
};
