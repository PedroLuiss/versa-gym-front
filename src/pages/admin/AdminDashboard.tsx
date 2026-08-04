import React from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  Package,
  CreditCard,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../hooks/useAdmin';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const { metrics, isLoadingMetrics, payments, gymOwners } = useAdmin();

  const pendingPayments = payments.filter((p) => p.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 p-8 rounded-2xl border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Panel de Administración General
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Versa Gym - Super Admin</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Control central de dueños de gimnasios, verificación de comprobantes y gestión de la plataforma SaaS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/payments">
            <Button variant="emerald" leftIcon={<CreditCard className="w-4 h-4" />}>
              Aprobar Pagos ({pendingPayments.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="space-y-3 border-indigo-500/20">
          <div className="flex items-center justify-between text-indigo-400">
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium text-zinc-400">Total Gimnasios</span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {isLoadingMetrics ? '...' : metrics?.total_gym_owners ?? gymOwners.length}
          </div>
          <p className="text-xs text-zinc-400">Gimnasios registrados en la plataforma</p>
        </Card>

        <Card className="space-y-3 border-emerald-500/20">
          <div className="flex items-center justify-between text-emerald-400">
            <CheckCircle className="w-6 h-6" />
            <span className="text-xs font-medium text-zinc-400">Suscripciones Activas</span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {isLoadingMetrics ? '...' : metrics?.active_subscriptions ?? 0}
          </div>
          <p className="text-xs text-zinc-400">Equipos de escritorio activos</p>
        </Card>

        <Card className="space-y-3 border-amber-500/20">
          <div className="flex items-center justify-between text-amber-400">
            <Clock className="w-6 h-6" />
            <span className="text-xs font-medium text-zinc-400">Pagos Pendientes</span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {isLoadingMetrics ? '...' : metrics?.pending_payments_count ?? pendingPayments.length}
          </div>
          <p className="text-xs text-zinc-400">Requieren validación de comprobante</p>
        </Card>

        <Card className="space-y-3 border-purple-500/20">
          <div className="flex items-center justify-between text-purple-400">
            <DollarSign className="w-6 h-6" />
            <span className="text-xs font-medium text-zinc-400">Recaudación Est.</span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {isLoadingMetrics ? '...' : formatCurrency(metrics?.total_revenue ?? 0)}
          </div>
          <p className="text-xs text-zinc-400">Total procesado y aprobado</p>
        </Card>
      </div>

      {/* Pending Payments Alert Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Solicitudes de Pago Pendientes por Revisar
          </h2>
          <Link to="/admin/payments" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
            Ver Todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingPayments.length === 0 ? (
          <Card className="text-center py-8 text-zinc-500 text-sm">
            🎉 No hay comprobantes pendientes por revisar en este momento.
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pendingPayments.slice(0, 4).map((p) => (
              <Card key={p.id} className="flex justify-between items-center bg-zinc-900/80 border-amber-500/30">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{p.payment_method}</span>
                    <Badge variant="pending">PENDIENTE</Badge>
                  </div>
                  <p className="text-xs text-zinc-400">Ref: <span className="font-mono text-zinc-200">{p.reference_number}</span></p>
                  <p className="text-xs text-zinc-400">Monto: <span className="font-bold text-emerald-400">{formatCurrency(p.amount)}</span></p>
                </div>
                <Link to="/admin/payments">
                  <Button size="sm" variant="emerald">Revisar</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Gym Owners Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Dueños de Gimnasios Registrados
          </h2>
          <Link to="/admin/gyms" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
            Ver Listado Completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Card className="overflow-x-auto p-0 border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Gimnasio</th>
                <th className="px-6 py-4">Dueño / Contacto</th>
                <th className="px-6 py-4">License Key</th>
                <th className="px-6 py-4">Equipo Vinculado</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
              {gymOwners.slice(0, 5).map((g) => (
                <tr key={g.id} className="hover:bg-zinc-800/40">
                  <td className="px-6 py-4 font-semibold text-white">{g.gym_name || 'Sin Nombre'}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-zinc-200">{g.name}</p>
                    <p className="text-xs text-zinc-400">{g.email}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-emerald-400">{g.license_key || 'N/A'}</td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {g.hardware_id ? (
                      <span className="text-emerald-400">PC ({g.hardware_id.substring(0, 10)}...)</span>
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
      </div>
    </div>
  );
};
