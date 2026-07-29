import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-zinc-900 border-emerald-500/30 text-emerald-400'
                : isError
                ? 'bg-zinc-900 border-rose-500/30 text-rose-400'
                : 'bg-zinc-900 border-indigo-500/30 text-indigo-400'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {isError && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 flex-shrink-0" />}
            
            <p className="text-sm font-medium text-zinc-200 flex-1">{toast.message}</p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
