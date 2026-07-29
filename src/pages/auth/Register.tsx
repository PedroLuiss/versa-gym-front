import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, Phone, ArrowLeft, UserPlus } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gymName, setGymName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');

    try {
      await register({
        name,
        email,
        gym_name: gymName,
        phone,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/dashboard');
    } catch {
      // Manejado en useAuth
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Registro de Dueño de Gimnasio</h2>
        <p className="text-sm text-zinc-400">
          Crea tu cuenta y disfruta de 30 días de prueba gratuita completa.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          type="text"
          placeholder="Carlos Rodríguez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="carlos@powergym.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre del Gimnasio"
            type="text"
            placeholder="PowerGym Central"
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            leftIcon={<Building className="w-4 h-4" />}
            required
          />

          <Input
            label="Teléfono / WhatsApp"
            type="tel"
            placeholder="+58 412 1234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          error={error}
          required
        />

        <Button
          type="submit"
          variant="emerald"
          className="w-full mt-2"
          isLoading={isRegistering}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Iniciar Prueba Gratuita (30 días)
        </Button>
      </form>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
        <Link to="/" className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
        </Link>
        <div className="text-zinc-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
