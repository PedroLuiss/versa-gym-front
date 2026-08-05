import React from 'react';
import { CreditCard, Clock, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useSubscription } from '../../hooks/useSubscription';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const PaymentHistory: React.FC = () => {
  const { payments, isLoadingPayments } = useSubscription();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Clock className="w-8 h-8 text-indigo-400" /> Historial de Pagos Reportados
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Consulta el historial y estado de todos los comprobantes de pago enviados al Super Admin para tu membresía SaaS.
        </p>
      </div>

      {/* Payment History Table */}
      {isLoadingPayments ? (
        <Card className="text-center py-12 text-zinc-400">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Cargando historial de pagos...</p>
        </Card>
      ) : payments.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-40 text-indigo-400" />
          <p className="text-base font-semibold text-zinc-300">No se han registrado reportes de pago aún.</p>
          <p className="text-xs text-zinc-500 mt-1">
            Cuando envíes un comprobante de transferencia para tu plan SaaS, aparecerá registrado en esta sección.
          </p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0 border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Fecha de Envío</th>
                <th className="px-6 py-4">Método de Pago</th>
                <th className="px-6 py-4">Nº Referencia</th>
                <th className="px-6 py-4">Monto Reportado</th>
                <th className="px-6 py-4">Estado del Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/40">
                  <td className="px-6 py-4 text-xs font-medium text-zinc-300">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    {p.payment_method}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-indigo-400">
                    {p.reference_number}
                  </td>
                  <td className="px-6 py-4 font-extrabold text-emerald-400">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status}>
                      {p.status === 'pending'
                        ? 'PENDIENTE'
                        : p.status === 'approved'
                        ? 'APROBADO'
                        : 'RECHAZADO'}
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
