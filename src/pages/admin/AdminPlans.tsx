import React, { useState } from 'react';
import { Plus, Check, Edit2, Trash2, Package } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../hooks/useAdmin';
import { formatCurrency } from '../../utils/formatters';

export const AdminPlans: React.FC = () => {
  const { plans, createPlan, updatePlan, deletePlan, isCreatingPlan } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [description, setDescription] = useState('');

  const handleOpenCreateModal = () => {
    setEditingPlanId(null);
    setName('');
    setPrice('');
    setDurationDays('30');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: any) => {
    setEditingPlanId(plan.id);
    setName(plan.name);
    setPrice(plan.price.toString());
    setDurationDays((plan.duration_days || 30).toString());
    setDescription(plan.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      price: parseFloat(price),
      duration_days: parseInt(durationDays, 10),
      description,
      active: true,
    };

    if (editingPlanId) {
      await updatePlan({ id: editingPlanId, data: payload });
    } else {
      await createPlan(payload);
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = async (plan: any) => {
    const newStatus = !(plan.active ?? plan.is_active);
    await updatePlan({ id: plan.id, data: { active: newStatus } });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-400" /> Gestión de Planes SaaS
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Crea, edita y administra las opciones de suscripción y alquiler del software ejecutable.
          </p>
        </div>

        <Button variant="emerald" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Crear Nuevo Plan
        </Button>
      </div>

      {/* Plans Catalog Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isActive = plan.active ?? plan.is_active ?? true;
          return (
            <Card key={plan.id} hoverEffect className="space-y-6 flex flex-col justify-between border-zinc-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <Badge variant={isActive ? 'active' : 'expired'}>
                    {isActive ? 'ACTIVO' : 'INACTIVO'}
                  </Badge>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-zinc-400 text-sm">/{plan.duration_days || 30} días</span>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {plan.description || 'Sin descripción adicional.'}
                </p>

                <ul className="space-y-2 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
                  {plan.features?.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenEditModal(plan)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Editar
                </Button>
                <Button
                  variant={isActive ? 'ghost' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleActive(plan)}
                  className={isActive ? 'text-rose-400 hover:bg-rose-950/30' : 'text-emerald-400'}
                >
                  {isActive ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Plan Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlanId ? 'Editar Plan SaaS' : 'Crear Nuevo Plan SaaS'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Plan"
            placeholder="Ej: Mensual Pro, Semestral, Anual Gold"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio (USD)"
              type="number"
              step="0.01"
              placeholder="19.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Duración (Días)"
              type="number"
              placeholder="30"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-300">Descripción y Características</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Acceso a software de escritorio. Sincronización en la nube. Licencia para 1 PC."
              className="w-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="emerald" type="submit" isLoading={isCreatingPlan}>
              {editingPlanId ? 'Guardar Cambios' : 'Crear Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
