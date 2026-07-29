import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Upload,
  Clock,
  Building,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useSubscription } from '../../hooks/useSubscription';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const Subscription: React.FC = () => {
  const { plans, subscription, payments, reportPayment, isReportingPayment } = useSubscription();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);

  const handleOpenModal = (planId: number) => {
    setSelectedPlanId(planId);
    setIsModalOpen(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !proofFile) return;

    try {
      await reportPayment({
        plan_id: selectedPlanId,
        payment_method: paymentMethod,
        reference_number: referenceNumber,
        proof_file: proofFile,
      });
      setIsModalOpen(false);
      setReferenceNumber('');
      setProofFile(null);
    } catch {
      // Manejado en hook
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Gestión de Suscripción</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Revisa tu plan actual, selecciona una renovación o reporta tu pago de manera rápida.
        </p>
      </div>

      {/* Available Plans Catalog */}
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} hoverEffect className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <Badge variant={plan.is_active ? 'active' : 'default'}>
                  {plan.billing_cycle.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {formatCurrency(plan.price, plan.currency || 'USD')}
                </span>
                <span className="text-zinc-400 text-sm">/{plan.billing_cycle === 'monthly' ? 'mes' : 'año'}</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-zinc-800">
                {plan.features?.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="emerald"
              className="w-full"
              onClick={() => handleOpenModal(plan.id)}
            >
              Reportar Pago de este Plan
            </Button>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" /> Historial de Pagos Reportados
        </h2>

        {payments.length === 0 ? (
          <Card className="text-center py-10 text-zinc-500">
            <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No se han registrado reportes de pago aún.</p>
          </Card>
        ) : (
          <Card className="overflow-x-auto p-0 border border-zinc-800">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Método</th>
                  <th className="px-6 py-4">Referencia</th>
                  <th className="px-6 py-4">Monto</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/40">
                    <td className="px-6 py-4">{formatDate(p.created_at)}</td>
                    <td className="px-6 py-4 font-medium">{p.payment_method}</td>
                    <td className="px-6 py-4 font-mono text-xs">{p.reference_number}</td>
                    <td className="px-6 py-4 font-semibold text-white">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={p.status}>{p.status.toUpperCase()}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Report Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reportar Pago de Suscripción"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-400" /> Datos Bancarios para Transferencia:
            </p>
            <p><strong>Banco:</strong> Banco de Venezuela / Zelle</p>
            <p><strong>Cuenta / Correo:</strong> pagos@versagym.com</p>
            <p><strong>Titular:</strong> VersaGym SaaS C.A.</p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-300">Método de Pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              <option value="Pago Móvil">Pago Móvil</option>
              <option value="Zelle">Zelle</option>
              <option value="Binance Pay">Binance Pay (USDT)</option>
            </select>
          </div>

          <Input
            label="Número de Referencia"
            placeholder="Ej: 94018274"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">Adjuntar Comprobante (Captura / Foto)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-emerald-400 hover:file:bg-zinc-700 cursor-pointer"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="emerald"
              type="submit"
              isLoading={isReportingPayment}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Enviar Reporte de Pago
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
