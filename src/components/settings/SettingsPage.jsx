import React, { useState } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Store, 
  DollarSign, 
  Bell, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  ShieldAlert,
  Save,
  Database,
  CloudUpload,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, setSettings, resetToDemoData, showToast, supabaseStatus, syncToSupabase } = useApp();

  const [formData, setFormData] = useState({
    storeName: settings.storeName || 'PhoneLytics Premium Store',
    tagline: settings.tagline || 'Official Smartphone Retail & Distribution',
    ownerName: settings.ownerName || 'Manager Sherzod',
    phone: settings.phone || '+998 71 200 00 24',
    address: settings.address || 'Tashkent City Mall, Level 2',
    currency: settings.currency || "so'm",
    lowStockThreshold: settings.lowStockThreshold || 5,
    receiptFooter: settings.receiptFooter || 'Thank you for shopping with PhoneLytics! 1 Year Official Warranty Included.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      ...formData,
      lowStockThreshold: Number(formData.lowStockThreshold)
    }));
    showToast('Store settings saved successfully!', 'success');
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
    showToast('Backup JSON exported successfully!', 'success');
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      <Header
        title="Store Settings & Configuration"
        subtitle="Manage business branding, threshold alerts, receipt headers, and store database."
        showDate={false}
        actionText=""
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Store Details Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#EAEAEA]">
            <Store className="w-5 h-5 text-[#FF7900]" />
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Retail Profile & Localization
            </h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  Store Legal Name
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
                  Store Tagline
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
                  Store Manager
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
                  Contact Phone
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
                  Primary Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                >
                  <option value="so'm">Uzbekistani Som (so'm)</option>
                  <option value="$">US Dollar ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                Physical Retail Location
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
                  Low Stock Threshold Alert (Units)
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
                  Triggers orange notification badges when stock falls to this count or below.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                  POS Receipt Footer Note
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
                className="px-6 py-2.5 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold shadow-md shadow-orange-500/10 flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Settings</span>
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
                  Supabase Cloud
                </h3>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#888888]">
                <span>Project URL:</span>
                <span className="font-mono text-[#171717] truncate max-w-[170px]" title="https://igpkeqbbaluqhjleennx.supabase.co">
                  igpkeqbbaluqhjleennx...
                </span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Status:</span>
                <span className="font-semibold text-emerald-700">Connected</span>
              </div>
            </div>

            <button
              onClick={syncToSupabase}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Sync All Data to Supabase</span>
            </button>

            <p className="text-[11px] text-[#888888] leading-tight">
              A database schema file (<code>supabase_schema.sql</code>) has been prepared in your project root. You can execute it in the Supabase SQL Editor anytime.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Data Management & Backup
            </h3>
            <p className="text-xs text-[#888888]">
              All smartphone inventory, sales logs, and daily reports persist in browser LocalStorage.
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 px-4 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-[#171717] text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-[#888888]" />
              <span>Export Full Store Backup (.json)</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-red-200 bg-red-50/20 p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#E5484D]" />
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                Reset Demo Data
              </h3>
            </div>
            <p className="text-xs text-[#888888]">
              Reset all inventory products, initial transactions, sample expenses, and daily reports back to official factory demo data.
            </p>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all store data back to demo defaults?")) {
                  resetToDemoData();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#E5484D] text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

