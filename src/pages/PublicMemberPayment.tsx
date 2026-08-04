import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dumbbell, CheckCircle2, AlertCircle, Upload, Send, ShieldCheck, CreditCard } from 'lucide-react';
import { memberPaymentApi } from '../api/memberPaymentApi';
import { GymPublicInfo } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const PublicMemberPayment: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [gymInfo, setGymInfo] = useState<GymPublicInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  // Form states
  const [memberName, setMemberName] = useState('');
  const [memberDni, setMemberDni] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [voucherFile, setVoucherFile] = useState<File | null>(null);

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorInfo('No se ha proporcionado un token válido en el enlace.');
      setLoadingInfo(false);
      return;
    }

    setLoadingInfo(true);
    memberPaymentApi
      .getPublicInfo(token)
      .then((data) => {
        setGymInfo(data);
        setErrorInfo(null);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Enlace de pago no válido o gimnasio no encontrado.';
        setErrorInfo(msg);
      })
      .finally(() => {
        setLoadingInfo(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !voucherFile) {
      setSubmitError('Por favor selecciona el archivo del comprobante de pago.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await memberPaymentApi.reportPayment({
        public_token: token,
        member_name: memberName,
        member_dni: memberDni,
        amount: amount ? parseFloat(amount) : undefined,
        reference,
        voucher: voucherFile,
        notes,
      });

      setSubmitSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Ocurrió un error al registrar el comprobante. Intenta nuevamente.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setMemberName('');
    setMemberDni('');
    setAmount('');
    setReference('');
    setNotes('');
    setVoucherFile(null);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  if (loadingInfo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-100">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-sm font-medium text-zinc-400">Cargando información del gimnasio...</p>
      </div>
    );
  }

  if (errorInfo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-100">
        <Card className="max-w-md w-full text-center py-8 px-6 space-y-4 border-rose-500/30">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Enlace No Válido</h2>
          <p className="text-xs text-zinc-400">{errorInfo}</p>
          <p className="text-xs text-zinc-500">Solicita un nuevo enlace de pago al administrador de tu gimnasio.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Banner */}
      <header className="max-w-md mx-auto w-full pt-4 pb-6 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Dumbbell className="w-7 h-7 text-zinc-950 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">{gymInfo?.gym_name}</h1>
        <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4" /> Portal Oficial de Reporte de Pagos
        </p>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto w-full flex-1 mb-8">
        {submitSuccess ? (
          <Card className="text-center py-10 px-6 space-y-6 border-emerald-500/30 bg-emerald-950/10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">¡Comprobante Enviado!</h2>
              <p className="text-xs text-zinc-300">
                Tu reporte ha sido registrado exitosamente para <strong className="text-emerald-400">{memberName}</strong>.
              </p>
              <p className="text-xs text-zinc-400">
                El administrador del gimnasio verificará la transferencia y actualizará tu acceso en el sistema.
              </p>
            </div>
            <Button variant="outline" className="w-full text-xs font-semibold" onClick={resetForm}>
              Enviar Otro Comprobante
            </Button>
          </Card>
        ) : (
          <Card className="border-zinc-800 bg-zinc-900/90 shadow-2xl p-6">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" /> Reportar Transferencia o Pago
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Completa tus datos y adjunta la foto o PDF del recibo para confirmar tu membresía.
              </p>
            </div>

            {submitError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nombre Completo del Alumno *</label>
                <Input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">DNI / Cédula de Identidad *</label>
                <Input
                  type="text"
                  placeholder="Ej. 12345678"
                  value={memberDni}
                  onChange={(e) => setMemberDni(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Monto Pagado ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nº Referencia *</label>
                  <Input
                    type="text"
                    placeholder="Ej. REF-987654"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Adjuntar Comprobante (JPG, PNG, PDF) *</label>
                <div className="relative border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-zinc-950/50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVoucherFile(e.target.files[0]);
                      }
                    }}
                    required
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
                    {voucherFile ? (
                      <p className="text-xs font-semibold text-emerald-400 truncate">{voucherFile.name}</p>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-zinc-300">Toca para seleccionar o arrastrar archivo</p>
                        <p className="text-[10px] text-zinc-500">Imágenes o PDF hasta 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Notas Opcionales</label>
                <textarea
                  rows={2}
                  placeholder="Comentario para el gimnasio (opcional)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <Button
                type="submit"
                variant="emerald"
                className="w-full py-3 text-sm font-bold shadow-lg shadow-emerald-500/20"
                isLoading={submitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Enviar Comprobante de Pago
              </Button>
            </form>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-zinc-500 pb-4">
        Powered by <strong className="text-zinc-400">VersaGym SaaS</strong> &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
