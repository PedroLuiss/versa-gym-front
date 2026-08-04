import { apiClient } from './axios';
import { ApiResponse, SaasPlan, SaasSubscription } from '../types';

export const subscriptionApi = {
  getPlans: async (): Promise<SaasPlan[]> => {
    const res = await apiClient.get<any>('/saas-plans');
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  getCurrentSubscription: async (): Promise<SaasSubscription> => {
    const res = await apiClient.get<any>('/subscription');
    const data = res.data;
    return data.data || data;
  },

  unbindDevice: async (): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>('/subscription/unbind-device');
    return res.data;
  },
};
