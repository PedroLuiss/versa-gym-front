import { apiClient } from './axios';
import { ApiResponse, Backup } from '../types';

export const backupApi = {
  getBackups: async (): Promise<Backup[]> => {
    const res = await apiClient.get<ApiResponse<Backup[]>>('/backups');
    return res.data.data;
  },
};
