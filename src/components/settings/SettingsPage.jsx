import React, { useState } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Store, 
  RotateCcw, 
  Download, 
  ShieldAlert,
  Save,
  Database,
  CloudUpload
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, setSettings, resetToDemoData, showToast, syncToSupabase } = useApp();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    storeName: settings.storeName || 'PhoneLytics Premium Store',
    tagline: settings.tagline || "Rasmiy Smartfonlar Do'koni va Servis Markazi",
    ownerName: settings.ownerName || 'Sherzod Rahimov',
    phone: settings.phone || '+998 71 200 00 24',
    address: settings.address || 'Toshkent sh., Navoiy ko\'chasi, 12-uy',
    currency: settings.currency || "so'm",
    lowStockThreshold: settings.lowStockThreshold || 5,
    receiptFooter: settings.receiptFooter || "PhoneLytics do'konini tanlaganingiz uchun rahmat! 1 Yillik Rasmiy Kafolat Beriladi."
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      ...formData,
      lowStockThreshold: Number(formData.lowStockThreshold)
    }));
    showToast("Do'kon sozlamalari muvaffaqiyatli saqlandi!", 'success');
  };

  const handleExportBackup = () => {
    const backupData = {
      products: localStorage.getItem('phonelytics_products'),
      transactions: localStorage.getItem('phonelytics_transactions'),
      expenses: localStorage.getItem('phonelytics_expenses'),
      dailyReports: localStorage.getItem('phonelytics_daily_reports'),
      settings: localStorage.getItem('phonelytics_settings'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phonelytics-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast("Zaxira nusxasi muvaffaqiyatli yuklab olindi!", 'success');
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      <Header
        title={t('settingsTitle')}
        subtitle={t('settingsSubtitle')}
        showDate={false}
        actionText=""
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Store Details Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#FF7900]" />
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                Do'kon Profili & Ma'lumotlari
              </h3>
            </div>
            {/* Store Icon Preview */}
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-[#EAEAEA] shadow-sm">
              <img src="/logo.png" alt="Store Icon" className="w-full h-full object-cover" />
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  {t('storeLegalName')}
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  {t('storeTagline')}
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  {t('storeManager')}
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  {t('contactPhone')}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  {t('primaryCurrency')}
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                >
                  <option value="so'm">O'zbekiston So'mi (so'm)</option>
                  <option value="$">AQSH Dollari ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                Do'kon Manzili (Filial)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  {t('lowStockThreshold')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
                <span className="text-[11px] text-[#888888] mt-1 block">
                  Ombordagi zaxira ushbu miqdorga yoki undan pastga tushganda ogohlantirish beriladi.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  Chek Tagidagi Kafolat Matni
                </label>
                <input
                  type="text"
                  value={formData.receiptFooter}
                  onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAEAEA] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold shadow-md shadow-orange-500/10 flex items-center gap-2 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t('saveSettingsBtn')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Data Management & Reset */}
        <div className="space-y-6">
          {/* Supabase Cloud Connection Card */}
          <div className="bg-white rounded-3xl border border-emerald-200 bg-emerald-50/20 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                  Supabase Buluti
                </h3>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Ulangan
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#888888]">
                <span>Loyiha URL:</span>
                <span className="font-mono text-[#171717] truncate max-w-[170px]" title="https://igpkeqbbaluqhjleennx.supabase.co">
                  igpkeqbbaluqhjleennx...
                </span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Holat:</span>
                <span className="font-semibold text-emerald-700">Faol (Sinxron)</span>
              </div>
            </div>

            <button
              onClick={syncToSupabase}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{t('syncSupabaseBtn')}</span>
            </button>

            <p className="text-[11px] text-[#888888] leading-tight">
              Loyiha ildizida <code>supabase_schema.sql</code> tayyorlangan. Istalgan paytda SQL Editor orqali jadvallarni kengaytirishingiz mumkin.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Ma'lumotlar Boshqaruvi
            </h3>
            <p className="text-xs text-[#888888]">
              Barcha smartfonlar ombori, savdo cheklari va kunlik hisobotlar xavfsiz saqlanadi.
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 px-4 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-[#171717] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#888888]" />
              <span>Do'kon Zaxira Nusxasini Yuklab Olish (.json)</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-red-200 bg-red-50/20 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#E5484D]" />
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                {t('resetDemoBtn')}
              </h3>
            </div>
            <p className="text-xs text-[#888888]">
              Barcha smartfonlar, tranzaksiyalar va hisobotlarni zavod demo holatiga qaytarish.
            </p>

            <button
              onClick={() => {
                if (window.confirm("Barcha ma'lumotlarni demo holatiga qaytarishni tasdiqlaysizmi?")) {
                  resetToDemoData();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#E5484D] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('resetDemoBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
