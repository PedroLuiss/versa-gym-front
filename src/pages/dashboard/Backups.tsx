import React from 'react';
import { Database, Download, HardDrive, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useBackups } from '../../hooks/useBackups';
import { formatDate, formatFileSize } from '../../utils/formatters';

export const Backups: React.FC = () => {
  const { backups, isLoading, refetch } = useBackups();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Copias de Seguridad (Backups)</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Respaldo automático de la base de datos de tu gimnasio desde la app de escritorio.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Actualizar Lista
        </Button>
      </div>

      {/* Backups List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : backups.length === 0 ? (
        <Card className="text-center py-16 space-y-4">
          <Database className="w-12 h-12 text-zinc-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white">No hay backups sincronizados</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1">
              Las copias de seguridad de tus socios y membresías se subirán automáticamente al abrir y cerrar la aplicación de escritorio.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden border border-zinc-800">
          <div className="divide-y divide-zinc-800">
            {backups.map((b) => (
              <div
                key={b.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-100 font-mono text-sm">{b.file_name}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 mt-0.5">
                      <span>Tamaño: {formatFileSize(b.file_size)}</span>
                      <span>•</span>
                      <span>Fecha: {formatDate(b.created_at)}</span>
                    </div>
                  </div>
                </div>

                <a href={b.download_url || '#'} download>
                  <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                    Descargar Backup
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
