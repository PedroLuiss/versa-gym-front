import { useQuery } from '@tanstack/react-query';
import { backupApi } from '../api/backupApi';

export const useBackups = () => {
  const backupsQuery = useQuery({
    queryKey: ['backups'],
    queryFn: backupApi.getBackups,
  });

  return {
    backups: backupsQuery.data || [],
    isLoading: backupsQuery.isLoading,
    refetch: backupsQuery.refetch,
  };
};
