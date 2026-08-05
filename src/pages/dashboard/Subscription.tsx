import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Check,
  Upload,
  Clock,
  Building,
  FileText,
  AlertCircle,
  Wallet,
  Lock,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useSubscription } from '../../hooks/useSubscription';
import { adminApi } from '../../api/adminApi';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { CompanyPaymentSetting } from '../../types';

export const Subscription: React.FC = () => {
  const { plans, subscription, payments, reportPayment, isReportingPayment } = useSubscription();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [companyMethods, setCompanyMethods] = useState<CompanyPaymentSetting[]>([]);
  const [loadingCompanyMethods, setLoadingCompanyMethods] = useState<boolean>(false);

  // Status checks for active subscription and pending payments
  const hasActiveSubscription = subscription?.status === 'active' && (subscription?.days_left ?? 0) > 0;
  const hasPendingPayment = payments.some((p) => p.status === 'pending');
  const cannotChangePlan = hasActiveSubscription || hasPendingPayment;

  useEffect(() => {
    setLoadingCompanyMethods(true);
    adminApi
      .getPublicCompanyPaymentMethods()
      .then((data) => setCompanyMethods(data))
      .catch(() => setCompanyMethods([]))
      .finally(() => setLoadingCompanyMethods(false));
  }, []);

  const handleOpenModal = (planId: number) => {
    if (cannotChangePlan) return;
    setSelectedPlanId(planId);
    setIsModalOpen(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !proofFile || cannotChangePlan) return;

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
      // Manejado en el hook
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

      {/* Warning Banners */}
      {hasActiveSubscription && (
        <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl text-amber-200 text-xs flex items-center gap-3 shadow-lg">
          <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-amber-300 text-sm">Suscripción Activa Vigente</p>
            <p className="text-zinc-300 mt-0.5 leading-relaxed">
              Tu <strong className="text-white">{subscription?.plan?.name ? `Plan ${subscription.plan.name}` : 'plan actual'}</strong> está vigente hasta el{' '}
              <strong className="text-amber-400">{formatDate(subscription?.end_date || subscription?.ends_at || '')}</strong> ({subscription?.days_left} días restantes). Debes esperar a que venza para cambiar o contratar un nuevo plan.
            </p>
          </div>
        </div>
      )}

      {hasPendingPayment && !hasActiveSubscription && (
        <div className="bg-indigo-950/40 border border-indigo-500/40 p-4 rounded-xl text-indigo-200 text-xs flex items-center gap-3 shadow-lg">
          <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <p className="font-bold text-indigo-300 text-sm">Reporte de Pago en Revisión</p>
            <p className="text-zinc-300 mt-0.5 leading-relaxed">
              Tienes una solicitud de pago enviada al Super Admin en proceso de revisión. Podrás seleccionar o modificar tu plan cuando el administrador verifique tu comprobante.
            </p>
          </div>
        </div>
      )}

      {/* Available Plans Catalog */}
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => {
          const billingCycle = plan.billing_cycle || (plan.duration_days ? `${plan.duration_days} DÍAS` : 'MENSUAL');
          const isActive = plan.is_active ?? (plan as any).active ?? true;

          return (
            <Card key={plan.id} hoverEffect className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <Badge variant={isActive ? 'active' : 'default'}>
                    {billingCycle.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {formatCurrency(plan.price, plan.currency || 'USD')}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    /{billingCycle.toLowerCase() === 'monthly' ? 'mes' : billingCycle.toLowerCase() === 'yearly' ? 'año' : 'periodo'}
                  </span>
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
                variant={cannotChangePlan ? 'outline' : 'emerald'}
                className={`w-full font-bold ${
                  cannotChangePlan ? 'opacity-60 cursor-not-allowed text-zinc-400 border-zinc-800' : ''
                }`}
                disabled={cannotChangePlan}
                onClick={() => handleOpenModal(plan.id)}
              >
                {hasActiveSubscription
                  ? '🔒 Suscripción Activa Vigente'
                  : hasPendingPayment
                  ? '⏳ Pago en Revisión'
                  : 'Reportar Pago de este Plan'}
              </Button>
            </Card>
          );
        })}
      </div>



      {/* Report Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reportar Pago de Suscripción"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3 text-xs text-zinc-400">
            <p className="font-bold text-white flex items-center gap-1.5 border-b border-zinc-800 pb-2">
              <Building className="w-4 h-4 text-emerald-400" /> Cuentas Oficiales VersaGym para Transferir:
            </p>
            {companyMethods.length === 0 ? (
              <p className="text-zinc-500 italic">No hay cuentas bancarias activas registradas. Contacta al soporte.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {companyMethods.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-emerald-400">
                      <span>{m.bank_name}</span>
                      <span className="text-[10px] uppercase font-mono bg-zinc-950 px-2 py-0.5 rounded text-zinc-400">
                        {m.payment_type}
                      </span>
                    </div>
                    <p className="text-zinc-200"><strong>Titular:</strong> {m.account_holder}</p>
                    {m.account_number && <p className="font-mono text-zinc-300"><strong>Cuenta:</strong> {m.account_number}</p>}
                    {m.id_number && <p><strong>RIF / DNI:</strong> {m.id_number}</p>}
                    {m.email_or_phone && <p className="font-mono text-indigo-300"><strong>Correo / Tel:</strong> {m.email_or_phone}</p>}
                    {m.notes && <p className="text-zinc-500 italic">{m.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-300">Método de Pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
            >
              {companyMethods.length > 0 ? (
                companyMethods.map((m) => (
                  <option key={m.id} value={`${m.bank_name} (${m.payment_type})`}>
                    {m.bank_name} - {m.account_holder}
                  </option>
                ))
              ) : (
                <>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Pago Móvil">Pago Móvil</option>
                  <option value="Zelle">Zelle</option>
                  <option value="PayPal">PayPal</option>
                </>
              )}
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
