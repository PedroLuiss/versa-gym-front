import React from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <div className="relative">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[800px] grid-bg pointer-events-none opacity-40 z-0"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#22ff92]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#ffb68d]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-12 md:pt-28 md:pb-24 px-6 md:px-12 max-w-[1280px] mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#222a3d] border border-[#3b4b3e]/50 mb-8 backdrop-blur-sm shadow-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#22ff92] animate-pulse"></span>
          <span className="font-mono text-xs text-[#b9cbba] uppercase tracking-wider">
            Versión 3.0 SaaS • 30 Días Gratis
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#dae2fd] mb-6 max-w-4xl mx-auto leading-tight">
          El Software más <span className="gradient-text">Versátil y Fácil de Usar</span> para transformar tu Gimnasio
        </h1>

        <p className="font-body text-lg sm:text-xl text-[#b9cbba] mb-10 max-w-2xl mx-auto leading-relaxed">
          Gestiona socios y automatiza cobros con una interfaz intuitiva diseñada para la simplicidad. Sincronización en la nube y potencia local en una herramienta que cualquiera puede dominar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to={isAuthenticated ? '/dashboard/subscription' : '/register'}
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-gradient-to-r from-[#22ff92] to-[#5dff9e] text-[#00723d] font-semibold text-lg button-glow transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            {isAuthenticated ? 'Adquirir Plan' : 'Probar 30 Días Gratis'}
          </Link>
          <a
            href="#caracteristicas"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-transparent border border-[#3b4b3e] text-[#dae2fd] hover:bg-[#171f33] hover:border-[#849586] font-semibold text-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined mr-2 text-xl">desktop_windows</span>
            Ver Demo de Escritorio
          </a>
        </div>

        {/* Hero Image / Mockup */}
        <div className="mt-16 w-full max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#22ff92]/20 to-[#ffb68d]/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative rounded-2xl overflow-hidden border border-[#3b4b3e] bg-[#060e20] emerald-glow shadow-2xl">
            {/* Faux Browser/App Header */}
            <div className="flex items-center px-4 py-3 border-b border-[#2d3449] bg-[#060e20]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#3b4b3e]/50"></div>
                <div className="w-3 h-3 rounded-full bg-[#3b4b3e]/50"></div>
                <div className="w-3 h-3 rounded-full bg-[#3b4b3e]/50"></div>
              </div>
              <div className="mx-auto bg-[#171f33] rounded-md px-3 py-1 border border-[#2d3449] flex items-center">
                <span className="material-symbols-outlined text-[#849586] mr-2 text-xs">lock</span>
                <span className="font-mono text-xs text-[#849586]">VersaGym Desktop App & Cloud SaaS</span>
              </div>
            </div>
            <img
              className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100"
              alt="VersaGym Modern Interface"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx8qqf4-2l1nAjxa3akmmeEoR0NEhtKI-favGqzuldykmKtLh8m8U7u7rthK_UrygMEiR_uuZ1xYm5ES49YDk5Kiaxh0XMvE8AcmlE8TBxI3hkvPy7cIcyHlTncEwJ4qsKPP1H09drOZV0fF8PuTkHSg-QEZvA-4-d7kN0NXARv7TB34Nj5ceBOdVxwIHnxAC8WMWAmTmMDbkxhzDY5F7TwU4kC_PFj-p0mdht96JBBY94zqXn9Uhr4A"
            />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF TICKER */}
      <section className="py-12 border-y border-[#3b4b3e]/20 bg-[#0b1326]/50 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 text-center">
          <p className="font-mono text-xs text-[#b9cbba] uppercase tracking-wider mb-8">
            Confían en nosotros +500 Gimnasios — Exclusivo y Potente
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-[#22ff92]">fitness_center</span>
              <span className="font-display font-bold">Gold's Gym</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-[#22ff92]">sports_martial_arts</span>
              <span className="font-display font-bold">IronBox Fitness</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-[#22ff92]">directions_run</span>
              <span className="font-display font-bold">VelociGym Center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-[#22ff92]">monitor_heart</span>
              <span className="font-display font-bold">Vitalidad Gym</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-[#22ff92]">bolt</span>
              <span className="font-display font-bold">Energía Fitness</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1280px] mx-auto" id="caracteristicas">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#dae2fd] mb-4">
            Herramientas de Nivel Empresarial
          </h2>
          <p className="font-body text-lg text-[#b9cbba] max-w-2xl mx-auto">
            Diseñadas para maximizar el control y minimizar la fricción en la gestión diaria de tus instalaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 border border-[#2d3449] hover:border-[#22ff92]/50 transition-all group overflow-hidden relative min-h-[300px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-[#060e20]/80 to-transparent z-10"></div>
            <div
              className="absolute top-0 right-0 w-3/4 h-3/4 opacity-30 group-hover:opacity-50 transition-opacity z-0 transform translate-x-10 -translate-y-10 bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDi2NBvZCjqd3Zf5lE-7h2uHTctUa5tga-LyFxhBOy6qao3QrAZk7y7tDpqv-cMsJmd0pcQXIi-2Sm8obCshoOv0Imm7E8j92mLNjitCURKcElCGF9aO1h2LlW_DcS5EviFjuQ8Ot0s-_iOrUyBk45wP4AI58oTIE2nU6DW5ekcaejfwUyRE3ppDhACXRVqEmPKsWUYINT_sjACQiEZamQhCV5ZbePEXS4AbY6DFgWCjRc5NzhqMljTA")',
              }}
            ></div>
            <div className="relative z-20">
              <div className="w-12 h-12 rounded-xl bg-[#22ff92]/10 flex items-center justify-center mb-6 text-[#22ff92] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>cloud_sync</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#dae2fd] mb-2">Sincronización en la Nube</h3>
              <p className="font-body text-sm text-[#b9cbba] max-w-md leading-relaxed">
                Tus datos seguros y accesibles desde cualquier lugar. Copias de seguridad automáticas y actualizaciones en tiempo real sin interrumpir la operación local.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-3xl p-8 border border-[#2d3449] hover:border-[#22ff92]/50 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#ffb68d]/10 rounded-full blur-2xl group-hover:bg-[#ffb68d]/20 transition-all"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ffb68d]/10 flex items-center justify-center mb-6 text-[#ffb68d] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>groups</span>
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#dae2fd] mb-2">Control Total de Membresías</h3>
              <p className="font-body text-sm text-[#b9cbba] leading-relaxed">
                Gestión automatizada de altas, bajas, vencimientos y alertas directamente en la app ejecutable.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-3xl p-8 border border-[#2d3449] hover:border-[#22ff92]/50 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#e6d9ff]/10 flex items-center justify-center mb-6 text-[#e6d9ff] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#dae2fd] mb-2">Licencia Inteligente</h3>
              <p className="font-body text-sm text-[#b9cbba] leading-relaxed">
                Configuración instantánea mediante License Key única por equipo. Activación segura y sin complicaciones.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 border border-[#2d3449] hover:border-[#22ff92]/50 transition-all group overflow-hidden relative flex flex-col justify-center items-start">
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[240px] text-[#22ff92]">query_stats</span>
            </div>
            <div className="relative z-20 max-w-md">
              <h3 className="font-display text-2xl font-bold text-[#dae2fd] mb-4">Backups Remotos de Seguridad</h3>
              <p className="font-body text-sm text-[#b9cbba] mb-6 leading-relaxed">
                Cada gimnasio mantiene copias de seguridad de sus archivos SQLite sincronizadas automáticamente con la nube SaaS para restauración inmediata.
              </p>
              <Link
                className="inline-flex items-center font-semibold text-sm text-[#ffb68d] hover:text-[#22ff92] transition-colors"
                to={isAuthenticated ? '/dashboard/backups' : '/register'}
              >
                Conocer Sistema de Respaldo
                <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ELECTRON DESKTOP FEATURE SHOWCASE */}
      <section className="py-24 bg-[#060e20] border-y border-[#3b4b3e]/20 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#dae2fd] leading-tight">
              Potencia Local,<br />Respaldo Global
            </h2>
            <p className="font-body text-lg text-[#b9cbba] leading-relaxed">
              No dependas de la velocidad de tu internet para operar en hora pico. VersaGym está construido para ofrecer una experiencia nativa de escritorio ultrarrápida. Las transacciones se procesan localmente y se respaldan en la nube SaaS de forma continua.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#22ff92] mt-1 text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
                <div>
                  <h4 className="font-display font-bold text-[#dae2fd]">Velocidad Incomparable</h4>
                  <p className="font-body text-sm text-[#b9cbba] mt-0.5">Check-in de socios y registro de cobranza en menos de 0.5 segundos.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#22ff92] mt-1 text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>wifi_off</span>
                <div>
                  <h4 className="font-display font-bold text-[#dae2fd]">Operatividad Offline Robusta</h4>
                  <p className="font-body text-sm text-[#b9cbba] mt-0.5">Sigue cobrando y registrando visitas aunque la conexión a internet falle temporalmente.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full">
            <div className="relative bg-[#222a3d] rounded-2xl p-4 border border-[#3b4b3e]/40 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-3 -right-3 z-20">
                <span className="inline-flex px-3 py-1 rounded-full bg-[#22ff92]/20 text-[#22ff92] border border-[#22ff92]/30 font-mono text-xs items-center gap-1.5 backdrop-blur-md font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#22ff92] animate-pulse"></span> Desktop App Engine
                </span>
              </div>
              <img
                className="rounded-xl w-full h-auto object-cover border border-[#2d3449]"
                alt="Desktop App Interface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcAptk-NhCNyTHtCV8yq5_8Uk8Y1VesQiOIc7_ndfQY-tgzqky8ZLkWz9X2J3Sl-Vb9Kv6SXrxHpkMjgMehkNP7kvvQpKed-QUs86S_FR16omNfcS-HD5bh4rIFyzyIdJrpH_SgiHtPtwt4sUbM1wEz3km5U2_d3WWMa8KHc7mNS_J4wH1XO6fukfNpesDSlHSolsRDV_dD0d5VI1_8Gt29LwuaMqKTqugUmDPMzmYcBB59BfIQltANA"
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY TICKER */}
      <section className="py-20 bg-[#060e20] overflow-hidden relative border-b border-[#3b4b3e]/20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-[#dae2fd] mb-3">Nuestra Comunidad de Éxito</h2>
          <p className="font-body text-[#b9cbba]">Gimnasios y centros deportivos optimizando sus operaciones con VersaGym.</p>
        </div>

        <div className="relative flex overflow-x-hidden">
          <div className="py-6 flex whitespace-nowrap gap-8 items-center animate-infinite-scroll">
            <div className="flex items-center gap-8">
              <div className="glass-card px-8 py-5 rounded-2xl border border-[#3b4b3e]/30 flex items-center gap-4 min-w-[260px]">
                <span className="material-symbols-outlined text-[#22ff92] text-3xl">fitness_center</span>
                <div className="text-left">
                  <h4 className="font-display font-bold text-white text-base">Powerhouse Fitness</h4>
                  <p className="font-mono text-xs text-[#b9cbba]">MADRID, ES</p>
                </div>
              </div>
              <div className="glass-card px-8 py-5 rounded-2xl border border-[#3b4b3e]/30 flex items-center gap-4 min-w-[260px]">
                <span className="material-symbols-outlined text-[#22ff92] text-3xl">self_improvement</span>
                <div className="text-left">
                  <h4 className="font-display font-bold text-white text-base">Zenith Training Center</h4>
                  <p className="font-mono text-xs text-[#b9cbba]">CARACAS, VE</p>
                </div>
              </div>
              <div className="glass-card px-8 py-5 rounded-2xl border border-[#3b4b3e]/30 flex items-center gap-4 min-w-[260px]">
                <span className="material-symbols-outlined text-[#22ff92] text-3xl">sports_mma</span>
                <div className="text-left">
                  <h4 className="font-display font-bold text-white text-base">Titan Gym Box</h4>
                  <p className="font-mono text-xs text-[#b9cbba]">BOGOTÁ, CO</p>
                </div>
              </div>
              <div className="glass-card px-8 py-5 rounded-2xl border border-[#3b4b3e]/30 flex items-center gap-4 min-w-[260px]">
                <span className="material-symbols-outlined text-[#22ff92] text-3xl">exercise</span>
                <div className="text-left">
                  <h4 className="font-display font-bold text-white text-base">Elite Crossfit</h4>
                  <p className="font-mono text-xs text-[#b9cbba]">SANTIAGO, CL</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="glass-card px-8 py-5 rounded-2xl border border-[#3b4b3e]/30 flex items-center gap-4 min-w-[260px]">
                <span className="material-symbols-outlined text-[#22ff92] text-3xl">fitness_center</span>
                <div className="text-left">
                  <h4 className="font-display font-bold text-white text-base">Powerhouse Fitness</h4>
                  <p className="font-mono text-xs text-[#b9cbba]">MADRID, ES</p>
                </div>
              </div>
              <div className="glass-card px-8 py-5 rounded-2xl border border-[#3b4b3e]/30 flex items-center gap-4 min-w-[260px]">
                <span className="material-symbols-outlined text-[#22ff92] text-3xl">self_improvement</span>
                <div className="text-left">
                  <h4 className="font-display font-bold text-white text-base">Zenith Training Center</h4>
                  <p className="font-mono text-xs text-[#b9cbba]">CARACAS, VE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC DATABASE PRICING SECTION */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1280px] mx-auto" id="planes">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#dae2fd] mb-4">
            Inversión Inteligente
          </h2>
          <p className="font-body text-lg text-[#b9cbba] max-w-2xl mx-auto">
            Escoge el plan que mejor se adapte a tu crecimiento.<br />
            <span className="text-[#22ff92] font-semibold">Sin compromiso, cancela o renueva en cualquier momento.</span>
          </p>
        </div>

        {isLoadingPlans ? (
          <div className="text-center py-12 text-[#b9cbba]">
            <div className="w-8 h-8 rounded-full border-2 border-[#22ff92] border-t-transparent animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-mono">Cargando planes de membresía...</p>
          </div>
        ) : dbPlans.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-[#2d3449]">
            <p className="font-display text-lg font-bold text-white">No hay planes publicados actualmente.</p>
            <p className="text-xs text-[#b9cbba] mt-2">Registra tu gimnasio para iniciar tu prueba gratuita de 30 días.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
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
                <div
                  key={plan.id || idx}
                  className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#131b2e] to-[#060e20] border-[#22ff92] emerald-glow transform md:scale-105 z-10'
                      : 'bg-[#060e20] border-[#2d3449] hover:border-[#849586]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                      <span className="bg-[#22ff92] text-[#00723d] font-mono text-xs uppercase px-4 py-1.5 rounded-full font-bold shadow-lg tracking-wider">
                        Mejor Valor
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-display text-2xl font-bold ${isPopular ? 'text-[#22ff92]' : 'text-white'}`}>
                        {plan.name}
                      </h3>
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#171f33] text-[#22ff92] border border-[#22ff92]/30 font-semibold">
                        {billingCycle}
                      </span>
                    </div>

                    <div>
                      <span className="font-display text-4xl font-extrabold text-[#dae2fd]">
                        {formatCurrency(plan.price, plan.currency || 'USD')}
                      </span>
                      <span className="font-body text-sm text-[#b9cbba] ml-1">/{periodText}</span>
                    </div>

                    <p className="font-body text-sm text-[#b9cbba] leading-relaxed">
                      {plan.description || 'Solución integral de gestión y licenciamiento para tu gimnasio.'}
                    </p>

                    <ul className="space-y-3 pt-4 border-t border-[#2d3449]/80">
                      {planFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-sm text-[#dae2fd]">
                          <span
                            className={`material-symbols-outlined text-lg ${isPopular ? 'text-[#22ff92]' : 'text-[#ffb68d]'}`}
                            style={{ fontVariationSettings: '"FILL" 1' }}
                          >
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link to={isAuthenticated ? `/dashboard/subscription?planId=${plan.id}` : '/register'}>
                      <button
                        className={`w-full h-14 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg ${
                          isPopular
                            ? 'bg-gradient-to-r from-[#22ff92] to-[#5dff9e] text-[#00723d] button-glow hover:scale-[1.02] active:scale-95'
                            : 'bg-transparent border border-[#2d3449] text-[#dae2fd] hover:bg-[#171f33] hover:border-[#849586] active:scale-95'
                        }`}
                      >
                        {isAuthenticated ? 'Adquirir Plan' : 'Seleccionar Plan'}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
