import React, { useState } from 'react';
import { Wallet, Plus, Edit2, Trash2, Building2, CheckCircle2, XCircle, CreditCard, PhoneCall, Mail } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../hooks/useAdmin';
import { CompanyPaymentSetting } from '../../types';

export const AdminCompanyPaymentSettings: React.FC = () => {
  const {
    companyPaymentMethods,
    isLoadingCompanyPaymentMethods,
    createCompanyPaymentMethod,
    isCreatingCompanyPaymentMethod,
    updateCompanyPaymentMethod,
    isUpdatingCompanyPaymentMethod,
    deleteCompanyPaymentMethod,
  } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<CompanyPaymentSetting | null>(null);

  // Form State
  const [bankName, setBankName] = useState('');
  const [paymentType, setPaymentType] = useState('bank_transfer');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingMethod(null);
    setBankName('');
    setPaymentType('bank_transfer');
    setAccountNumber('');
    setAccountHolder('VersaGym C.A.');
    setIdNumber('');
    setEmailOrPhone('');
    setNotes('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (method: CompanyPaymentSetting) => {
    setEditingMethod(method);
    setBankName(method.bank_name);
    setPaymentType(method.payment_type || 'bank_transfer');
    setAccountNumber(method.account_number || '');
    setAccountHolder(method.account_holder);
    setIdNumber(method.id_number || '');
    setEmailOrPhone(method.email_or_phone || '');
    setNotes(method.notes || '');
    setIsActive(method.is_active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      bank_name: bankName,
      payment_type: paymentType,
      account_number: accountNumber || undefined,
      account_holder: accountHolder,
      id_number: idNumber || undefined,
      email_or_phone: emailOrPhone || undefined,
      notes: notes || undefined,
      is_active: isActive,
    };

    if (editingMethod) {
      await updateCompanyPaymentMethod({ id: editingMethod.id, data: payload });
    } else {
      await createCompanyPaymentMethod(payload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta cuenta de pago de la empresa?')) {
      await deleteCompanyPaymentMethod(id);
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case 'zelle':
        return <Badge variant="active">ZELLE</Badge>;
      case 'pago_movil':
        return <Badge variant="trial">PAGO MÓVIL</Badge>;
      case 'paypal':
        return <Badge variant="active">PAYPAL</Badge>;
      case 'bank_transfer':
      default:
        return <Badge variant="expired">TRANSFERENCIA</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-indigo-400" /> Cuentas & Datos de Pago VersaGym
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Administra las cuentas bancarias, Zelle y Pago Móvil oficiales para recibir el pago de suscripciones SaaS.
          </p>
        </div>

        <Button variant="emerald" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Agregar Nueva Cuenta
        </Button>
      </div>

      {/* Grid of Methods */}
      {isLoadingCompanyPaymentMethods ? (
        <Card className="text-center py-12 text-zinc-400">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Cargando datos de pago de la empresa...</p>
        </Card>
      ) : companyPaymentMethods.length === 0 ? (
        <Card className="text-center py-12 text-zinc-500">
          <Wallet className="w-12 h-12 mx-auto mb-3 opacity-40 text-indigo-400" />
          <p className="text-base font-semibold text-zinc-300">No hay cuentas de pago configuradas.</p>
          <p className="text-xs text-zinc-500 mt-1">Haz clic en "Agregar Nueva Cuenta" para registrar una cuenta bancaria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyPaymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`flex flex-col justify-between p-6 space-y-4 border transition-all ${
                method.is_active ? 'border-zinc-800 bg-zinc-900' : 'border-rose-900/30 bg-zinc-950 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{method.bank_name}</h3>
                      {getPaymentTypeBadge(method.payment_type)}
                    </div>
                  </div>

                  <span className="text-xs">
                    {method.is_active ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Inactivo
                      </span>
                    )}
                  </span>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-500 font-medium">Titular:</span>
                    <p className="font-semibold text-zinc-200">{method.account_holder}</p>
                  </div>

                  {method.account_number && (
                    <div>
                      <span className="text-zinc-500 font-medium">Nº Cuenta / IBAN:</span>
                      <p className="font-mono text-indigo-400 font-bold break-all">{method.account_number}</p>
                    </div>
                  )}

                  {method.id_number && (
                    <div>
                      <span className="text-zinc-500 font-medium">Documento / RIF / Cédula:</span>
                      <p className="font-mono text-zinc-300">{method.id_number}</p>
                    </div>
                  )}

                  {method.email_or_phone && (
                    <div>
                      <span className="text-zinc-500 font-medium">Correo o Teléfono:</span>
                      <p className="font-mono text-emerald-400 font-semibold">{method.email_or_phone}</p>
                    </div>
                  )}

                  {method.notes && (
                    <div className="pt-2 border-t border-zinc-800 text-zinc-400 italic">
                      "{method.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(method)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-400 hover:bg-rose-950/30"
                  onClick={() => handleDelete(method.id)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMethod ? 'Editar Cuenta de Pago Oficial' : 'Agregar Nueva Cuenta de Pago Oficial'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nombre del Banco o Método *</label>
              <Input
                type="text"
                placeholder="Ej. Banco Mercantil, Zelle, Pago Móvil, PayPal"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Tipo de Pago *</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="bank_transfer">Transferencia Bancaria</option>
                  <option value="pago_movil">Pago Móvil</option>
                  <option value="zelle">Zelle</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Titular de la Cuenta *</label>
                <Input
                  type="text"
                  placeholder="Ej. VersaGym C.A."
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Número de Cuenta / IBAN</label>
              <Input
                type="text"
                placeholder="Ej. 0105-0000-00-0000000000"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Documento / RIF / Tax ID</label>
                <Input
                  type="text"
                  placeholder="Ej. J-12345678-0"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Correo o Teléfono (Zelle/PagoMóvil)</label>
                <Input
                  type="text"
                  placeholder="Ej. pagos@versagym.com o 0412-1234567"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Instrucciones o Notas Adicionales</label>
              <textarea
                rows={2}
                placeholder="Indicaciones para el dueño del gimnasio al transferir..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="text-xs text-zinc-300 font-medium">
                Mostrar esta cuenta como disponible para los dueños de gimnasio
              </label>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="emerald"
                isLoading={isCreatingCompanyPaymentMethod || isUpdatingCompanyPaymentMethod}
              >
                {editingMethod ? 'Guardar Cambios' : 'Crear Cuenta'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
