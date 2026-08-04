import React, { useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Eye, FileText, Calendar, Building, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../hooks/useAdmin';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { SaasPayment } from '../../types';

export const AdminPayments: React.FC = () => {
  const { payments, approvePayment, rejectPayment, isApprovingPayment, isRejectingPayment } = useAdmin();
  const [selectedPayment, setSelectedPayment] = useState<SaasPayment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPayments = payments.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const handleApprove = async (id: number) => {
    await approvePayment(id);
    setSelectedPayment(null);
  };

  const handleReject = async (id: number) => {
    if (window.confirm('¿Estás seguro de rechazar este pago?')) {
      await rejectPayment(id);
      setSelectedPayment(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-indigo-400" /> Revisión y Aprobación de Pagos
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Valida los comprobantes de pago enviados por los gimnasios para activar o renovar sus licencias.
          </p>
        </div>

        {/* Filter Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Filtrar por estado:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Todos los Pagos</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-semibold">No hay pagos registrados bajo este filtro.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0 border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Gimnasio / Usuario</th>
                <th className="px-6 py-4">Método</th>
                <th className="px-6 py-4">Referencia</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/40">
                  <td className="px-6 py-4 text-xs">{formatDate(p.created_at)}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{(p as any).user?.gym_name || `Gimnasio #${p.user_id}`}</p>
                    <p className="text-xs text-zinc-400">{(p as any).user?.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{p.payment_method}</td>
                  <td className="px-6 py-4 font-mono text-xs text-indigo-400">{p.reference_number}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status}>{p.status.toUpperCase()}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedPayment(p)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Ver Detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Detailed Review Modal */}
      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          title="Detalle y Verificación del Comprobante"
        >
          <div className="space-y-6">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-500">Gimnasio:</span>
                <p className="font-bold text-white text-sm">{(selectedPayment as any).user?.gym_name || 'Gimnasio'}</p>
                <p className="text-zinc-400">{(selectedPayment as any).user?.email}</p>
              </div>
              <div>
                <span className="text-zinc-500">Monto Reportado:</span>
                <p className="font-extrabold text-emerald-400 text-lg">{formatCurrency(selectedPayment.amount)}</p>
              </div>
              <div>
                <span className="text-zinc-500">Método de Pago:</span>
                <p className="font-medium text-zinc-200">{selectedPayment.payment_method}</p>
              </div>
              <div>
                <span className="text-zinc-500">Número de Referencia:</span>
                <p className="font-mono text-indigo-400 font-bold">{selectedPayment.reference_number}</p>
              </div>
            </div>

            {/* Proof Image Container */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300">Imagen del Comprobante de Pago:</label>
              {selectedPayment.proof_url ? (
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-2 overflow-hidden text-center">
                  <img
                    src={selectedPayment.proof_url.startsWith('http') ? selectedPayment.proof_url : `http://localhost:8000/storage/${selectedPayment.proof_url}`}
                    alt="Comprobante de Pago"
                    className="max-h-80 mx-auto rounded-lg object-contain"
                  />
                  <a
                    href={selectedPayment.proof_url.startsWith('http') ? selectedPayment.proof_url : `http://localhost:8000/storage/${selectedPayment.proof_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-indigo-400 hover:underline font-medium"
                  >
                    Ver Imagen Completa en Pestaña Nueva ↗
                  </a>
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-800 p-6 text-center text-zinc-500 text-xs rounded-xl">
                  Sin archivo adjunto disponible.
                </div>
              )}
            </div>

            {/* Approval / Rejection Actions */}
            {selectedPayment.status === 'pending' && (
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  className="text-rose-400 hover:bg-rose-950/30"
                  onClick={() => handleReject(selectedPayment.id)}
                  isLoading={isRejectingPayment}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Rechazar Pago
                </Button>
                <Button
                  variant="emerald"
                  onClick={() => handleApprove(selectedPayment.id)}
                  isLoading={isApprovingPayment}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Aprobar Pago y Activar Licencia
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
