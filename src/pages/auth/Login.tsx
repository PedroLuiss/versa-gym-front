import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch {
      // Manejado por useAuth toast
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
        <p className="text-sm text-zinc-400">
          Accede al panel de control de tu gimnasio para gestionar tu suscripción y licencias.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="dueno@mi-gimnasio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="emerald"
          className="w-full mt-2"
          isLoading={isLoggingIn}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Acceder al Panel
        </Button>
      </form>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
        <Link to="/" className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
        </Link>
        <div className="text-zinc-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
