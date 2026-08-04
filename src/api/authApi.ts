import { apiClient } from './axios';
import { ApiResponse, AuthResponse } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  gym_name?: string;
  phone?: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<any>('/login', payload);
    const data = res.data;
    const token = data.access_token || data.token || data.data?.token;
    const user = data.user || data.data?.user;
    const subscription = data.subscription || data.data?.subscription;
    return { token, user, subscription };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<any>('/register', payload);
    const data = res.data;
    const token = data.access_token || data.token || data.data?.token;
    const user = data.user || data.data?.user;
    const subscription = data.subscription || data.data?.subscription;
    return { token, user, subscription };
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/logout');
  },

  me: async (): Promise<AuthResponse> => {
    const res = await apiClient.get<any>('/user');
    const data = res.data;
    const user = data.user || data.data?.user || data;
    const subscription = user?.subscription;
    return { token: '', user, subscription };
  },
};
