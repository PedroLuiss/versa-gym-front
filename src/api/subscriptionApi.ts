import { apiClient } from './axios';
import { ApiResponse, SaasPlan, SaasSubscription } from '../types';

export const subscriptionApi = {
  getPlans: async (): Promise<SaasPlan[]> => {
    const res = await apiClient.get<ApiResponse<SaasPlan[]>>('/saas-plans');
    return res.data.data;
  },

  getCurrentSubscription: async (): Promise<SaasSubscription> => {
    const res = await apiClient.get<ApiResponse<SaasSubscription>>('/subscription/current');
    return res.data.data;
  },
};
