import React, { useState } from 'react';
import {
  Key,
  Copy,
  Check,
  Download,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Monitor,
  Sparkles,
  Gift,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { copyToClipboard } from '../../utils/clipboard';
import { useUIStore } from '../../store/uiStore';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { subscriptionApi } from '../../api/subscriptionApi';

export const Overview: React.FC = () => {
  const { user, subscription } = useAuth();
  const addToast = useUIStore((s) => s.addToast);
  const [copied, setCopied] = useState(false);
  const [isUnbinding, setIsUnbinding] = useState(false);
  const [hardwareId, setHardwareId] = useState<string | null>(user?.hardware_id || null);

  // License Key & Status
  const licenseKey = user?.license_key || subscription?.license_key || 'VERSA-TRIAL-KEY-0001';
  const status = subscription?.status || user?.status || 'trial';
  const daysLeft = subscription?.days_left ?? subscription?.trial_days_left ?? 30;

  // Active Plan Information
  const activePlanName = subscription?.plan?.name
    ? `Plan ${subscription.plan.name}`
    : status === 'trial'
    ? 'Prueba Gratuita (30 días)'
    : 'Suscripción Activa';

  const expirationDate = subscription?.end_date || subscription?.ends_at || subscription?.trial_ends_at;

  const handleCopyKey = async () => {
    const success = await copyToClipboard(licenseKey);
    if (success) {
      setCopied(true);
      addToast('success', 'License Key copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnbindDevice = async () => {
    if (
      !window.confirm(
        '¿Estás seguro de que deseas desvincular la computadora actual? Podrás activar la licencia en un nuevo equipo.'
      )
    ) {
      return;
    }

    try {
      setIsUnbinding(true);
      const res = await subscriptionApi.unbindDevice();
      setHardwareId(null);
      addToast('success', res.message || 'Equipo desvinculado exitosamente.');
    } catch {
      addToast('error', 'Error al desvincular el equipo.');
    } finally {
      setIsUnbinding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Trial Welcome Banner for New Gym Owners */}
      {status === 'trial' && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-indigo-950/60 p-6 rounded-2xl border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Gift className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  🎉 ¡30 Días Gratis de Uso!
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">¡Bienvenido a VersaGym, {user?.name}!</h2>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                Al descargar e instalar la aplicación de escritorio contarás con <strong className="text-emerald-400">30 días totalmente gratis</strong> de acceso ilimitado para gestionar los miembros de tu gimnasio. Copia tu clave de licencia a continuación para activar tu equipo.
              </p>
            </div>
          </div>

          <Link to="/dashboard/subscription" className="shrink-0 w-full sm:w-auto">
            <Button variant="emerald" size="sm" className="w-full font-bold">
              Ver Planes Disponibles
            </Button>
          </Link>
        </div>
      )}

      {/* Main Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 p-8 rounded-2xl border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Panel de Control SaaS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            ¡Hola, {user?.name || 'Dueño de Gimnasio'}!
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Gimnasio: <span className="text-zinc-200 font-semibold">{user?.gym_name || 'Mi Gimnasio'}</span>
          </p>
        </div>

        <a href="#" download>
          <Button variant="emerald" size="lg" leftIcon={<Download className="w-5 h-5" />}>
            Descargar VersaGym para PC
          </Button>
        </a>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* License Key Card */}
        <Card className="md:col-span-2 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Clave de Licencia (License Key)</h3>
                <p className="text-xs text-zinc-400">Clave única para ingresar en la App de Escritorio</p>
              </div>
            </div>
            <Badge variant={status}>{status.toUpperCase()}</Badge>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4 font-mono">
            <span className="text-base sm:text-lg font-bold text-emerald-400 tracking-wider truncate">
              {licenseKey}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyKey}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>

          {/* Machine Binding Info Footer */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <div>
              {hardwareId ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Vinculado a PC (ID: {hardwareId.substring(0, 12)}...)
                </span>
              ) : (
                <span className="text-amber-400 font-medium">
                  ⚠️ Lista para activar en la App Ejecutable de tu PC
                </span>
              )}
            </div>

            {hardwareId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnbindDevice}
                isLoading={isUnbinding}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
              >
                Desvincular Equipo
              </Button>
            )}
          </div>
        </Card>

        {/* Active Plan & Expiration Card */}
        <Card className="space-y-4 flex flex-col justify-between border-emerald-500/30 bg-zinc-900/90">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Plan Actual</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">{activePlanName}</h3>

            <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-2">
              {daysLeft} <span className="text-xs text-zinc-400 font-normal">días vigentes</span>
            </div>

            {expirationDate && (
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Vence el: <span className="text-zinc-200 font-semibold">{formatDate(expirationDate)}</span>
              </p>
            )}
          </div>

          <Link to="/dashboard/subscription">
            <Button variant="outline" size="sm" className="w-full font-semibold" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              Gestionar / Renovar Plan
            </Button>
          </Link>
        </Card>
      </div>

      {/* Quick Setup Instructions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">1. Instala la app Ejecutable</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Descarga e instala el software ejecutable en la computadora de recepción de tu gimnasio. Funciona sin conexión a internet permanente.
          </p>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">2. Copia de Seguridad Automática</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Tu app de escritorio sincronizará periódicamente copias de seguridad de tus socios en este servidor SaaS. Podrás restaurarlas cuando quieras.
          </p>
        </Card>
      </div>
    </div>
  );
};
