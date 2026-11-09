import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
        let borderClass = "border-emerald-200 bg-white";
        
        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-[#E5484D] flex-shrink-0" />;
          borderClass = "border-red-200 bg-white";
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-5 h-5 text-[#F5A623] flex-shrink-0" />;
          borderClass = "border-amber-200 bg-white";
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
          borderClass = "border-blue-200 bg-white";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg ${borderClass} transition-all duration-300 transform translate-y-0 min-w-[280px] max-w-md animate-fade-in`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium text-[#171717]">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#888888] hover:text-[#171717] p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

