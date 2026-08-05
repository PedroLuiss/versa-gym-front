import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  HardDrive,
  Check,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscriptionApi';
import { formatCurrency, formatBillingCycle, formatCyclePeriod } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const { data: dbPlans = [], isLoading: isLoadingPlans } = useQuery({
    queryKey: ['public-saas-plans'],
    queryFn: subscriptionApi.getPlans,
  });

  const features = [
    {
      icon: Zap,
      title: 'Control total de Membresías',
      description: 'Gestión ágil de socios, planes, cobros y vencimientos en tiempo real desde tu aplicación de escritorio.',
    },
    {
      icon: HardDrive,
      title: 'Backups automáticos en la Nube',
      description: 'Copias de seguridad automáticas resguardadas de forma cifrada en la plataforma SaaS.',
    },
    {
      icon: Lock,
      title: 'Licencia Inteligente por Dispositivo',
      description: 'Activación simple con License Key para garantizar la operatividad de tu gimnasio sin interrupciones.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="trial" className="mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 30 Días de Prueba Gratuita Sin Compromiso
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            El Software SaaS que potencia la <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">gestión de tu gimnasio</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal">
            Control de socios, licencias automáticas y copias de seguridad en la nube. Diseñado para ofrecer la máxima velocidad en escritorio con respaldo SaaS.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? '/dashboard/subscription' : '/register'}>
              <Button variant="emerald" size="lg" className="w-full sm:w-auto font-bold" rightIcon={<ArrowRight className="w-5 h-5" />}>
                {isAuthenticated ? 'Adquirir Plan' : 'Comenzar Prueba Gratis (30 días)'}
              </Button>
            </Link>
            <a href="#plans">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver Planes de Suscripción
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Matrix */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Diseñado para la máxima eficiencia operacional
          </h2>
          <p className="mt-3 text-zinc-400">
            Todo lo que necesita tu centro deportivo en una arquitectura moderna e intuitiva.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Dynamic Database Pricing Section */}
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Planes transparentes para cada etapa
          </h2>
          <p className="mt-3 text-zinc-400">
            Sin costos ocultos. Cancela o cambia de plan en cualquier momento.
          </p>
        </div>

        {isLoadingPlans ? (
          <div className="text-center py-12 text-zinc-400">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Cargando planes de membresía...</p>
          </div>
        ) : dbPlans.length === 0 ? (
          <Card className="text-center py-12 text-zinc-500 max-w-md mx-auto">
            <p className="text-base font-semibold text-zinc-300">No hay planes publicados actualmente.</p>
            <p className="text-xs text-zinc-500 mt-1">Registra tu gimnasio para iniciar la prueba gratuita de 30 días.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {dbPlans.map((plan, idx) => {
              const billingCycle = formatBillingCycle(plan.billing_cycle, plan.duration_days);
              const periodText = formatCyclePeriod(plan.billing_cycle, plan.duration_days);
              const isPopular = plan.name.toLowerCase().includes('anual') || idx === 1;

              const planFeatures = plan.features && plan.features.length > 0
                ? plan.features
                : [
                    'Licencia ejecutable VersaGym para PC',
                    'Gestión ilimitada de socios del gimnasio',
                    'Backups automáticos cifrados en la nube',
                    'Soporte técnico y actualizaciones incluidas',
                  ];

              return (
                <Card
                  key={plan.id || idx}
                  className={`relative space-y-6 flex flex-col justify-between ${
                    isPopular ? 'border-emerald-500/50 ring-1 ring-emerald-500/30 bg-zinc-900/90' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Recomendado
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <Badge variant="active" className="text-[10px]">
                        {billingCycle}
                      </Badge>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">
                        {formatCurrency(plan.price, plan.currency || 'USD')}
                      </span>
                      <span className="text-zinc-400 text-sm font-medium">
                        /{periodText}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {plan.description || 'Solución integral de gestión y licenciamiento para tu gimnasio.'}
                    </p>

                    <ul className="space-y-3 pt-4 border-t border-zinc-800">
                      {planFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={isAuthenticated ? `/dashboard/subscription?planId=${plan.id}` : '/register'}>
                    <Button
                      variant={isPopular ? 'emerald' : 'secondary'}
                      className="w-full mt-6 font-bold"
                    >
                      {isAuthenticated ? 'Adquirir Plan' : 'Registrar mi Gimnasio'}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
