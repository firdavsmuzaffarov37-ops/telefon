import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Smartphone, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

export default function LoginPage() {
  const { login, demoLogin, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Authentication error');
    }
  };

  const handleDemo = (role) => {
    demoLogin(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Language Bar */}
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Monogram */}
        <div className="w-12 h-12 rounded-2xl bg-[#FF7900] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 mx-auto mb-3 group hover:scale-105 transition">
          <Smartphone className="w-6 h-6 stroke-[2.3]" />
        </div>
        <h2 className="text-2xl font-black text-[#171717] tracking-tight font-['Plus_Jakarta_Sans']">
          Phone<span className="text-[#FF7900]">Lytics</span>
        </h2>
        <p className="text-xs text-[#888888] mt-1 font-medium">
          {t('loginSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#EAEAEA] shadow-card space-y-6">
          <div className="text-center pb-2 border-b border-[#F0F0F0]">
            <h3 className="text-lg font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              {t('loginTitle')}
            </h3>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E5484D] font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('emailLabel')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@phonelytics.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#171717]">
                  {t('passwordLabel')} *
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset link simulated.'); }} className="text-[11px] text-[#FF7900] hover:underline font-medium">
                  {t('forgotPassword')}
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#171717]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? t('loading') : t('signInBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Presets */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#EAEAEA]" />
              <span className="flex-shrink mx-3 text-[11px] text-[#888888] font-semibold uppercase tracking-wider">
                1-Click Demo Access
              </span>
              <div className="flex-grow border-t border-[#EAEAEA]" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="p-2.5 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-[11px] font-bold text-[#171717] flex items-center justify-center gap-1.5 transition text-center"
              >
                <span>👔 {t('demoLoginBtn')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('cashier')}
                className="p-2.5 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-[11px] font-bold text-[#171717] flex items-center justify-center gap-1.5 transition text-center"
              >
                <span>🛒 {t('demoSalesLoginBtn')}</span>
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="text-center pt-2 border-t border-[#F0F0F0]">
            <p className="text-xs text-[#888888]">
              {t('dontHaveAccount')}{' '}
              <NavLink to="/register" className="font-bold text-[#FF7900] hover:underline">
                {t('signUpBtn')}
              </NavLink>
            </p>
          </div>
        </div>

        {/* Security watermark */}
        <div className="flex items-center justify-center gap-2 mt-6 text-[11px] text-[#888888]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Connected with Supabase Cloud & 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
