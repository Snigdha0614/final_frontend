import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, UserCheck, Sparkles, Code, Palette, Zap } from 'lucide-react';

export const DemoAccountBar = () => {
  const { user, quickSwitch } = useAuth();
  const { addToast } = useToast();

  const handleSwitch = async (key, name) => {
    try {
      await quickSwitch(key);
      addToast(`Switched account to ${name}`, 'success');
    } catch (err) {
      addToast('Failed to switch demo account: ' + err.message, 'error');
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs py-1.5 px-4 text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Demo Switcher:
          </span>
          <span className="hidden sm:inline text-slate-400">
            Current: <strong className="text-white">{user ? `${user.fullName} (${user.role.replace('ROLE_', '')})` : 'Guest'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => handleSwitch('admin', 'Admin')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
              user?.email === 'admin@talenttrade.com'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-purple-300'
            }`}
            title="admin@talenttrade.com (pass: password123)"
          >
            <ShieldCheck className="w-3 h-3" />
            Admin
          </button>

          <button
            onClick={() => handleSwitch('client', 'Sarah (Client)')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
              user?.email === 'sarah.client@talenttrade.com'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
            }`}
            title="sarah.client@talenttrade.com (pass: password123)"
          >
            <UserCheck className="w-3 h-3" />
            Sarah (Client)
          </button>

          <button
            onClick={() => handleSwitch('alex', 'Alex (Full-Stack)')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
              user?.email === 'alex.dev@talenttrade.com'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-blue-300'
            }`}
            title="alex.dev@talenttrade.com (pass: password123)"
          >
            <Code className="w-3 h-3" />
            Alex (Dev)
          </button>

          <button
            onClick={() => handleSwitch('elena', 'Elena (Design)')}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
              user?.email === 'elena.design@talenttrade.com'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-pink-300'
            }`}
            title="elena.design@talenttrade.com (pass: password123)"
          >
            <Palette className="w-3 h-3" />
            Elena (Design)
          </button>
        </div>
      </div>
    </div>
  );
};
