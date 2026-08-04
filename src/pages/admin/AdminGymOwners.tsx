import React, { useState } from 'react';
import { Users, Key, Monitor, Shield, Phone, Mail, Search, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../hooks/useAdmin';
import { formatDate } from '../../utils/formatters';

export const AdminGymOwners: React.FC = () => {
  const { gymOwners, isLoadingGymOwners } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOwners = gymOwners.filter((g) => {
    const matchesSearch =
      (g.gym_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.license_key || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (g as any).status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" /> Directorio de Dueños de Gimnasios
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Monitorea los gimnasios afiliados, sus licencias activas y los equipos vinculados a la app ejecutable.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por gimnasio, nombre, email o licencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <span className="text-zinc-400">Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Todos los Estados</option>
            <option value="trial">Prueba (Trial)</option>
            <option value="active">Activo</option>
            <option value="expired">Expirado</option>
          </select>
        </div>
      </div>

      {/* Owners Table */}
      {filteredOwners.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-semibold">No se encontraron gimnasios con estos criterios.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0 border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Gimnasio</th>
                <th className="px-6 py-4">Propietario & Contacto</th>
                <th className="px-6 py-4">Clave de Licencia</th>
                <th className="px-6 py-4">Estado Equipo PC</th>
                <th className="px-6 py-4">Estado Suscripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
              {filteredOwners.map((g) => (
                <tr key={g.id} className="hover:bg-zinc-800/40">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-base">{g.gym_name || 'Sin Nombre'}</p>
                    <p className="text-xs text-zinc-500">ID Usuario: #{g.id}</p>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <p className="font-semibold text-zinc-200">{g.name}</p>
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-indigo-400" /> {g.email}
                    </p>
                    {g.phone && (
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" /> {g.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <span className="bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 text-emerald-400 font-bold">
                      {g.license_key || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {g.hardware_id ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Monitor className="w-3.5 h-3.5" /> Vinculado ({g.hardware_id.substring(0, 10)}...)
                      </span>
                    ) : (
                      <span className="text-zinc-500">Sin Vincular</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={(g as any).status || 'trial'}>
                      {((g as any).status || 'trial').toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
