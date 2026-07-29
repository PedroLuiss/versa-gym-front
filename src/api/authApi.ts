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
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/login', payload);
    return res.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/register', payload);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/logout');
  },

  me: async (): Promise<AuthResponse> => {
    const res = await apiClient.get<ApiResponse<AuthResponse>>('/me');
    return res.data.data;
  },
};
