import { apiClient } from './axios';
import { ApiResponse, Backup } from '../types';

export const backupApi = {
  getBackups: async (): Promise<Backup[]> => {
    const res = await apiClient.get<any>('/backups');
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.backups)) return data.backups;
    return [];
  },
};
