import React, { useState } from 'react';
import { Users, Copy, Check, ExternalLink, CheckCircle, XCircle, Eye, CreditCard, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useMemberPayments } from '../../hooks/useMemberPayments';
import { useUIStore } from '../../store/uiStore';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { MemberPayment } from '../../types';

export const MemberPayments: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { payments, publicToken, isLoading, approvePayment, isApproving, rejectPayment, isRejecting } =
    useMemberPayments(statusFilter === 'all' ? undefined : statusFilter);

  const addToast = useUIStore((s) => s.addToast);
  const [copied, setCopied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<MemberPayment | null>(null);

  const publicLink = `${window.location.origin}/reportar-pago/${publicToken || 'token-no-disponible'}`;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    addToast('success', '¡Enlace público copiado al portapapeles!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleApprove = async (id: number) => {
    await approvePayment(id);
    setSelectedPayment(null);
  };

  const handleReject = async (id: number) => {
    if (window.confirm('¿Estás seguro de rechazar este pago de alumno?')) {
      await rejectPayment({ id });
      setSelectedPayment(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Link Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-400" /> Cobranza & Pagos de Alumnos
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Gestiona y verifica los comprobantes de pago enviados por tus alumnos desde el portal web.
          </p>
        </div>
      </div>

      {/* Shareable Link Card */}
      <Card className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-indigo-950/30 border border-emerald-500/30 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> Enlace Público para Cobro a Alumnos
            </span>
            <p className="text-xs text-zinc-300">
              Comparte este enlace con tus alumnos por WhatsApp o Redes para que reporten sus transferencias.
            </p>
            <p className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 break-all select-all mt-2">
              {publicLink}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="emerald"
              size="sm"
              onClick={copyLinkToClipboard}
              leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? '¡Copiado!' : 'Copiar Enlace'}
            </Button>
            <a href={publicLink} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                Probar Vista
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* Table Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Filtrar por estado:</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Todos los Comprobantes</option>
            <option value="pending">Pendientes de Revisión</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <Card className="text-center py-12 text-zinc-400">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Cargando registros de pagos...</p>
        </Card>
      ) : payments.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-semibold text-zinc-400">No hay pagos de alumnos bajo este filtro.</p>
          <p className="text-xs text-zinc-500 mt-1">Comparte tu enlace público para comenzar a recibir comprobantes.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0 border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Alumno</th>
                <th className="px-6 py-4">DNI / Cédula</th>
                <th className="px-6 py-4">Referencia</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/40">
                  <td className="px-6 py-4 text-xs">{formatDate(p.created_at)}</td>
                  <td className="px-6 py-4 font-bold text-white">{p.member_name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-400">{p.member_dni}</td>
                  <td className="px-6 py-4 font-mono text-xs text-emerald-400">{p.reference}</td>
                  <td className="px-6 py-4 font-extrabold text-white">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status}>{p.status.toUpperCase()}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedPayment(p)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Revisar Comprobante
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Review Modal */}
      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          title="Verificación de Pago de Alumno"
        >
          <div className="space-y-6">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-500">Alumno:</span>
                <p className="font-bold text-white text-sm">{selectedPayment.member_name}</p>
                <p className="text-zinc-400">DNI: {selectedPayment.member_dni}</p>
              </div>
              <div>
                <span className="text-zinc-500">Monto Reportado:</span>
                <p className="font-extrabold text-emerald-400 text-lg">{formatCurrency(selectedPayment.amount)}</p>
              </div>
              <div>
                <span className="text-zinc-500">Nº de Referencia:</span>
                <p className="font-mono text-indigo-400 font-bold">{selectedPayment.reference}</p>
              </div>
              <div>
                <span className="text-zinc-500">Estado Actual:</span>
                <div className="mt-0.5">
                  <Badge variant={selectedPayment.status}>{selectedPayment.status.toUpperCase()}</Badge>
                </div>
              </div>
            </div>

            {/* Proof Image / File Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300">Imagen del Voucher o Recibo:</label>
              {selectedPayment.voucher_path ? (
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 text-center">
                  <img
                    src={`http://localhost:8000/storage/${selectedPayment.voucher_path}`}
                    alt="Voucher de Alumno"
                    className="max-h-80 mx-auto rounded-lg object-contain"
                  />
                  <a
                    href={`http://localhost:8000/storage/${selectedPayment.voucher_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-emerald-400 hover:underline font-medium"
                  >
                    Abrir Archivo en Pestaña Nueva ↗
                  </a>
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-800 p-6 text-center text-zinc-500 text-xs rounded-xl">
                  Sin comprobante adjunto disponible.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedPayment.status === 'pending' && (
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  className="text-rose-400 hover:bg-rose-950/30"
                  onClick={() => handleReject(selectedPayment.id)}
                  isLoading={isRejecting}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Rechazar Pago
                </Button>
                <Button
                  variant="emerald"
                  onClick={() => handleApprove(selectedPayment.id)}
                  isLoading={isApproving}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Aprobar Pago
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
