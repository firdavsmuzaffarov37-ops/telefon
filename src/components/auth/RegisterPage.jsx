import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Smartphone, Mail, Lock, User, Store, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const res = await register(email, password, fullName, storeName);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Language Bar */}
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FF7900] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 mx-auto mb-3">
          <Smartphone className="w-6 h-6 stroke-[2.3]" />
        </div>
        <h2 className="text-2xl font-black text-[#171717] tracking-tight font-['Plus_Jakarta_Sans']">
          Phone<span className="text-[#FF7900]">Lytics</span>
        </h2>
        <p className="text-xs text-[#888888] mt-1 font-medium">
          {t('registerSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#EAEAEA] shadow-card space-y-6">
          <div className="text-center pb-2 border-b border-[#F0F0F0]">
            <h3 className="text-lg font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              {t('registerTitle')}
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
                {t('fullNameLabel')} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Jasur Karimov"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('storeNameLabel')}
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. PhoneLytics Navoi Retail"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('emailLabel')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="owner@domain.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                {t('passwordLabel')} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? t('loading') : t('signUpBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link to Login */}
          <div className="text-center pt-2 border-t border-[#F0F0F0]">
            <p className="text-xs text-[#888888]">
              {t('alreadyHaveAccount')}{' '}
              <NavLink to="/login" className="font-bold text-[#FF7900] hover:underline">
                {t('signInBtn')}
              </NavLink>
            </p>
          </div>
        </div>

        {/* Security watermark */}
        <div className="flex items-center justify-center gap-2 mt-6 text-[11px] text-[#888888]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase PostgreSQL Encrypted Database</span>
        </div>
      </div>
    </div>
  );
}
