import React, { useState } from 'react';
import { Role } from '../types/job';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  X, 
  CheckCircle2, 
  Zap, 
  Building2, 
  KeyRound
} from 'lucide-react';
import { APP_LOGO_URL } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: Role;
  onLoginAsRole: (role: Role) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onLoginAsRole,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex.morgan@workpulse.io');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<Role>(activeRole);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessNotice(true);
    setTimeout(() => {
      onLoginAsRole(selectedRole);
      setSuccessNotice(false);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = (role: Role) => {
    setSelectedRole(role);
    setSuccessNotice(true);
    setTimeout(() => {
      onLoginAsRole(role);
      setSuccessNotice(false);
      onClose();
    }, 500);
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div 
        id="auth-modal-dialog"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 relative overflow-hidden transition-colors"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={APP_LOGO_URL}
            alt="WorkPulse Logo"
            className="h-10 w-auto object-contain"
          />
          <div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight font-['Outfit']">
              Work<span className="text-blue-600 dark:text-blue-400">Pulse</span>
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Identity &amp; Workspace Access
            </span>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-1 mb-4">
          <button
            type="button"
            onClick={() => setSelectedRole('job_seeker')}
            className={`py-2 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 ${
              selectedRole === 'job_seeker'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Candidate</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('enterprise')}
            className={`py-2 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 ${
              selectedRole === 'enterprise'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Enterprise</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 ${
              selectedRole === 'admin'
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Admin</span>
          </button>
        </div>

        {/* Quick 1-Click Demo Profiles */}
        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 mb-4 text-xs">
          <p className="font-bold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Quick Demo Evaluation Login:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('job_seeker')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-blue-100/50 dark:hover:bg-slate-700 font-bold transition text-left"
            >
              <span className="text-[9px] text-blue-600 dark:text-blue-400 block truncate font-bold">Candidate</span>
              <span className="truncate block text-[11px]">Alex M.</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('enterprise')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-blue-100/50 dark:hover:bg-slate-700 font-bold transition text-left"
            >
              <span className="text-[9px] text-indigo-600 dark:text-indigo-400 block truncate font-bold">Enterprise</span>
              <span className="truncate block text-[11px]">Anthropic Lead</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-blue-100/50 dark:hover:bg-slate-700 font-bold transition text-left"
            >
              <span className="text-[9px] text-amber-600 dark:text-amber-400 block truncate font-bold">System Admin</span>
              <span className="truncate block text-[11px]">Elena R.</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-700 text-blue-600 w-3.5 h-3.5" />
              <span>Remember this device</span>
            </label>
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold">
              Forgot password?
            </span>
          </div>

          {successNotice ? (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Authentication Verified! Loading workspace...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              Sign In as {selectedRole === 'job_seeker' ? 'Candidate' : 'Admin'}
            </button>
          )}
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Protected by Enterprise 2FA &amp; Biometric SSO</span>
        </div>
      </div>
    </div>
  );
};
