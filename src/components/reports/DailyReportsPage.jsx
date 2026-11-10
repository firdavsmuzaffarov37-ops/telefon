import React, { useState, useMemo } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate, getTodayDateString } from '../../utils/formatters';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Smartphone, 
  Receipt, 
  Plus, 
  Trash2, 
  Archive,
  AlertCircle,
  Copy,
  Printer,
  Sparkles,
  Layers,
  Send,
  Check
} from 'lucide-react';

export default function DailyReportsPage() {
  const { 
    transactions, 
    products, 
    expenses, 
    addExpense, 
    deleteExpense, 
    dailyReports, 
    closeDayAndGenerateReport,
    showToast,
    settings
  } = useApp();
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [reportPeriod, setReportPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [reportNotes, setReportNotes] = useState('');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCopiedTelegram, setIsCopiedTelegram] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Electricity',
    name: '',
    amount: '',
    notes: ''
  });

  // Calculate stats for the selected period (Kunlik, Haftalik yoki Oylik)
  const dayTxns = useMemo(() => {
    if (reportPeriod === 'monthly') {
      const monthStr = selectedDate.slice(0, 7);
      return transactions.filter(t => t.date.startsWith(monthStr));
    }
    if (reportPeriod === 'weekly') {
      const targetTime = new Date(`${selectedDate}T23:59:59`).getTime();
      const weekAgoTime = targetTime - (7 * 24 * 60 * 60 * 1000);
      return transactions.filter(t => {
        const tTime = new Date(t.date).getTime();
        return tTime >= weekAgoTime && tTime <= targetTime;
      });
    }
    // Default: daily
    return transactions.filter(t => t.date.startsWith(selectedDate));
  }, [transactions, selectedDate, reportPeriod]);

  const dayExpenses = useMemo(() => {
    if (reportPeriod === 'monthly') {
      const monthStr = selectedDate.slice(0, 7);
      return expenses.filter(e => e.date.startsWith(monthStr));
    }
    if (reportPeriod === 'weekly') {
      const targetTime = new Date(`${selectedDate}T23:59:59`).getTime();
      const weekAgoTime = targetTime - (7 * 24 * 60 * 60 * 1000);
      return expenses.filter(e => {
        const eTime = new Date(e.date).getTime();
        return eTime >= weekAgoTime && eTime <= targetTime;
      });
    }
    return expenses.filter(e => e.date.startsWith(selectedDate));
  }, [expenses, selectedDate, reportPeriod]);

  const totalDayExpenses = useMemo(() => {
    return dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [dayExpenses]);

  const phonesSold = useMemo(() => {
    return dayTxns.reduce((sum, t) => sum + Number(t.quantity), 0);
  }, [dayTxns]);

  const revenue = useMemo(() => {
    return dayTxns.reduce((sum, t) => sum + Number(t.revenue), 0);
  }, [dayTxns]);

  const purchaseCost = useMemo(() => {
    return dayTxns.reduce((sum, t) => sum + Number(t.cost), 0);
  }, [dayTxns]);

  const discounts = useMemo(() => {
    return dayTxns.reduce((sum, t) => sum + Number(t.discount || 0), 0);
  }, [dayTxns]);

  const grossProfit = revenue - purchaseCost;
  const netProfit = grossProfit - totalDayExpenses;

  // Remaining inventory stats
  const remainingCount = useMemo(() => {
    return products.reduce((sum, p) => sum + Number(p.stock), 0);
  }, [products]);

  const remainingValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.stock) * Number(p.sellingPrice)), 0);
  }, [products]);

  // Model-by-model aggregated breakdown (User's specific requirement)
  const modelBreakdown = useMemo(() => {
    const grouped = {};
    dayTxns.forEach(t => {
      const key = t.productName || 'Noma\'lum smartfon';
      if (!grouped[key]) {
        grouped[key] = {
          name: key,
          brand: t.brand || 'Boshqa',
          quantity: 0,
          colors: {},
          sellingPrice: Number(t.sellingPrice) || 0,
          purchasePrice: Number(t.purchasePrice) || 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          discount: 0
        };
      }
      grouped[key].quantity += Number(t.quantity);
      grouped[key].revenue += Number(t.revenue);
      grouped[key].cost += Number(t.cost);
      grouped[key].profit += Number(t.profit);
      grouped[key].discount += Number(t.discount || 0);

      const col = t.color || 'Standart';
      grouped[key].colors[col] = (grouped[key].colors[col] || 0) + Number(t.quantity);
    });

    return Object.values(grouped).sort((a, b) => b.revenue - a.revenue);
  }, [dayTxns]);

  // Payment Breakdown
  const paymentBreakdown = useMemo(() => {
    const res = { Card: 0, Cash: 0, 'Bank Transfer': 0 };
    dayTxns.forEach(t => {
      const key = t.paymentMethod?.includes('Card') ? 'Card' :
                  t.paymentMethod?.includes('Cash') ? 'Cash' :
                  t.paymentMethod?.includes('Transfer') ? 'Bank Transfer' : t.paymentMethod;
      res[key] = (res[key] || 0) + Number(t.revenue);
    });
    return res;
  }, [dayTxns]);

  // Best selling phone for that day
  const bestSellingPhone = useMemo(() => {
    if (modelBreakdown.length > 0) {
      return `${modelBreakdown[0].name} (${modelBreakdown[0].quantity} dona)`;
    }
    return "—";
  }, [modelBreakdown]);

  // Check if report already exists for selectedDate
  const existingReport = useMemo(() => {
    return dailyReports.find(r => r.date === selectedDate);
  }, [dailyReports, selectedDate]);

  const handleGenerateReport = () => {
    closeDayAndGenerateReport(selectedDate, reportNotes);
  };

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;

    addExpense({
      ...newExpense,
      amount: Number(newExpense.amount),
      date: new Date(`${selectedDate}T12:00:00`).toISOString()
    });

    setNewExpense({
      category: 'Electricity',
      name: '',
      amount: '',
      notes: ''
    });
    setIsExpenseModalOpen(false);
  };

  // Format and copy Telegram Evening Closing Report
  const handleCopyTelegramReport = () => {
    const lines = [];
    lines.push(`📊 ${settings?.storeName || 'PHONELYTICS'} — KUNLIK SMENA ACHOTI`);
    lines.push(`📅 Sana: ${formatDate(selectedDate)}`);
    lines.push(`🏢 Filial: ${settings?.address || 'Toshkent'}`);
    lines.push(`==============================`);
    lines.push(`📱 MODELMA-MODEL SOTILGAN SMARTFONLAR:`);

    if (modelBreakdown.length === 0) {
      lines.push(`(Bugun hech qanday savdo amalga oshirilmadi)`);
    } else {
      modelBreakdown.forEach((m, idx) => {
        const colorStr = Object.entries(m.colors)
          .map(([col, qty]) => `${qty}x ${col}`)
          .join(', ');
        lines.push(`${idx + 1}. ${m.name}: ${m.quantity} dona`);
        lines.push(`   🎨 Ranglari: ${colorStr}`);
        lines.push(`   💵 Tushum: ${formatCurrency(m.revenue)} | Sof foyda: +${formatCurrency(m.profit)}`);
      });
    }

    lines.push(`------------------------------`);
    lines.push(`📊 UMUMIY SMENA KO'RSATKICHLARI:`);
    lines.push(`📦 Jami sotildi: ${phonesSold} ta smartfon`);
    lines.push(`💰 Jami tushum (Kassa): ${formatCurrency(revenue)}`);
    if (discounts > 0) lines.push(`🏷️ Berilgan chegirmalar: -${formatCurrency(discounts)}`);
    lines.push(`📉 Mahsulotlar tannarxi: -${formatCurrency(purchaseCost)}`);
    lines.push(`📈 Yalpi foyda: +${formatCurrency(grossProfit)}`);
    lines.push(`🏢 Do'kon xarajatlari: -${formatCurrency(totalDayExpenses)}`);
    lines.push(`==============================`);
    lines.push(`✨ BUGUN BIR KUNDA SHUNCHA SOF FOYDA QILIBMIZ: +${formatCurrency(netProfit)}!`);
    lines.push(`📦 Omborda qolgan jami telefonlar: ${remainingCount} dona`);
    lines.push(`==============================`);

    const fullText = lines.join('\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopiedTelegram(true);
      showToast('Telegram uchun to\'liq hisobot nusxalandi! Telegramga tashlashingiz mumkin.', 'success');
      setTimeout(() => setIsCopiedTelegram(false), 3000);
    }).catch(() => {
      showToast('Nusxa olishda xatolik yuz berdi', 'error');
    });
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <Header
        title="Moliyaviy Hisobotlar (Kunlik, Haftalik, Oylik)"
        subtitle="Har bir model, rang, sotilgan dona, alohida summasi va davr bo'yicha jami sof foyda hisoboti"
        showDate={false}
        actionText={existingReport ? "Hisobotni Yangilash" : t('closeDayBtn')}
        actionIcon={CheckCircle2}
        onActionClick={handleGenerateReport}
      />

      {/* Period Tabs: Kunlik, Haftalik, Oylik */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#EAEAEA] shadow-sm overflow-x-auto w-full sm:w-fit">
        <button
          onClick={() => setReportPeriod('daily')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            reportPeriod === 'daily'
              ? 'bg-[#171717] text-white shadow-sm'
              : 'text-[#666666] hover:bg-neutral-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Kunlik Natijalar (Z-Report)</span>
        </button>

        <button
          onClick={() => setReportPeriod('weekly')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            reportPeriod === 'weekly'
              ? 'bg-[#171717] text-white shadow-sm'
              : 'text-[#666666] hover:bg-neutral-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Haftalik Natijalar (7 Kun)</span>
        </button>

        <button
          onClick={() => setReportPeriod('monthly')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            reportPeriod === 'monthly'
              ? 'bg-[#171717] text-white shadow-sm'
              : 'text-[#666666] hover:bg-neutral-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Oylik Natijalar</span>
        </button>
      </div>

      {/* Date Selector & Closing Notification */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#FF7900]" />
          <span className="text-xs font-bold text-[#171717]">
            {reportPeriod === 'monthly' ? "Hisobot Oyi:" : reportPeriod === 'weekly' ? "Hafta Yakuniy Sanasi:" : t('selectReportDate')}
          </span>
          <input
            type={reportPeriod === 'monthly' ? "month" : "date"}
            value={reportPeriod === 'monthly' ? selectedDate.slice(0, 7) : selectedDate}
            onChange={(e) => setSelectedDate(e.target.value.length === 7 ? `${e.target.value}-01` : e.target.value)}
            className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs text-[#171717] font-semibold focus:ring-1 focus:ring-[#FF7900] focus:outline-none cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyTelegramReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition cursor-pointer"
          >
            {isCopiedTelegram ? <Check className="w-4 h-4 text-emerald-600" /> : <Send className="w-4 h-4 text-sky-600" />}
            <span>{isCopiedTelegram ? "Nusxalandi!" : "Telegramga Achot Olish"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-100 text-[#171717] hover:bg-neutral-200 border border-[#EAEAEA] text-xs font-bold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#666]" />
            <span>Chop etish (Z-Report)</span>
          </button>

          {existingReport ? (
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('reportOfficialArchived')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{t('reportOpenDay')}</span>
            </div>
          )}
        </div>
      </div>

      {/* GRAND SOF FOYDA BANNERI (Celebratory Period Closing Banner) */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-900/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {reportPeriod === 'monthly' ? `Oylik Moliyaviy Natija (${selectedDate.slice(0, 7)})` :
               reportPeriod === 'weekly' ? `Haftalik Moliyaviy Natija (7 kunlik)` :
               `Kechki Smena Yakuniy Achoti (${formatDate(selectedDate)})`}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            {reportPeriod === 'monthly' ? "Ushbu oyda shuncha sof foyda qilibmiz: " :
             reportPeriod === 'weekly' ? "Ushbu 7 kunda shuncha sof foyda qilibmiz: " :
             "Bugun bir kunda shuncha sof foyda qilibmiz: "}
            <span className="text-amber-300 underline decoration-amber-300/40 underline-offset-8">
              +{formatCurrency(netProfit)}
            </span>
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm pt-1">
            Jami sotilgan: <strong className="text-white font-bold">{phonesSold} ta smartfon</strong> • 
            Kassadagi tushum: <strong className="text-white font-bold">{formatCurrency(revenue)}</strong> • 
            Do'kon xarajatlari: <strong className="text-amber-200 font-bold">-{formatCurrency(totalDayExpenses)}</strong> • 
            Omborda qolgan: <strong className="text-white font-bold">{remainingCount} dona</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          <button
            onClick={handleCopyTelegramReport}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-[0.98] font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Telegramga Nusxa Olish</span>
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Smenani Yopish</span>
          </button>
        </div>
      </div>

      {/* MODELMA-MODEL BATAFSIL SAVDOLAR JADVALI (Har bir telefon alohida summasi va foydasi) */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF7900]" />
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                Modelma-Model Sotilgan Smartfonlar va Alohida Summalari
              </h3>
            </div>
            <p className="text-xs text-[#888888] mt-0.5">
              Har bir smartfon rusumi bo'yicha sotilgan dona, ranglari, 1 dona sotuv va tannarxi, umumiy tushumi hamda sof foydasi
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-50 text-[#FF7900] border border-orange-200 self-start sm:self-auto">
            Jami sotilgan turlar: {modelBreakdown.length} ta
          </span>
        </div>

        {modelBreakdown.length === 0 ? (
          <div className="py-12 text-center text-[#888888] text-xs">
            {formatDate(selectedDate)} sanasida hech qanday telefon sotilmagan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#888888] bg-neutral-50/70">
                  <th className="py-3 px-3.5 font-bold"># Smartfon Rusumi</th>
                  <th className="py-3 px-3 font-bold text-center">Sotilgan Miqdor</th>
                  <th className="py-3 px-3 font-bold">Sotilgan Ranglar</th>
                  <th className="py-3 px-3 font-bold">1 Dona Sotuv / Tannarx</th>
                  <th className="py-3 px-3 font-bold">Jami Tushum</th>
                  <th className="py-3 px-3 font-bold">Jami Tannarx</th>
                  <th className="py-3 px-3 font-bold text-right">Ushbu Modeldan Foyda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {modelBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-[#171717] text-xs">{item.name}</div>
                      <span className="text-[10px] text-[#888888] font-semibold">{item.brand}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 text-[#FF7900] font-black text-xs border border-orange-200">
                        {item.quantity} dona
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {Object.entries(item.colors).map(([col, qty], cIdx) => (
                          <span key={cIdx} className="text-[10px] font-semibold bg-neutral-100 text-[#444] px-2 py-0.5 rounded-md border border-neutral-200">
                            <strong>{qty}x</strong> {col}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-[#171717]">{formatCurrency(item.sellingPrice)}</div>
                      <div className="text-[10.5px] text-[#888888]">Tannarxi: {formatCurrency(item.purchasePrice)}</div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#171717]">
                      {formatCurrency(item.revenue)}
                      {item.discount > 0 && (
                        <div className="text-[10px] text-[#E5484D] font-semibold">
                          (Chegirma: -{formatCurrency(item.discount)})
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-[#666666] font-semibold">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-block px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200">
                        +{formatCurrency(item.profit)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50/50 font-black text-xs border-t-2 border-emerald-200 text-[#171717]">
                  <td className="py-3 px-3.5">JAMI MODELMA-MODEL:</td>
                  <td className="py-3 px-3 text-center text-[#FF7900]">{phonesSold} dona</td>
                  <td className="py-3 px-3 text-[#888888] font-normal">—</td>
                  <td className="py-3 px-3 text-[#888888] font-normal">—</td>
                  <td className="py-3 px-3 text-[#171717]">{formatCurrency(revenue)}</td>
                  <td className="py-3 px-3 text-[#666666]">-{formatCurrency(purchaseCost)}</td>
                  <td className="py-3 px-3 text-right text-emerald-700">+{formatCurrency(grossProfit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Phones Sold */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">{t('phonesSold')}</span>
            <Smartphone className="w-5 h-5 text-[#FF7900]" />
          </div>
          <h3 className="text-2xl font-black text-[#171717] mt-3 font-['Plus_Jakarta_Sans']">
            {phonesSold} <span className="text-xs font-semibold text-[#888888]">{t('reportUnits')}</span>
          </h3>
          <p className="text-xs text-[#888888] mt-1 truncate">Top: {bestSellingPhone}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">{t('statRevenueToday')}</span>
            <DollarSign className="w-5 h-5 text-[#0284C7]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#171717] mt-3 font-['Plus_Jakarta_Sans'] truncate">
            {formatCurrency(revenue)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">{t('discount')}: {formatCurrency(discounts)}</p>
        </div>

        {/* Gross Profit */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">{t('grossProfit')}</span>
            <TrendingUp className="w-5 h-5 text-[#16A36A]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-3 font-['Plus_Jakarta_Sans'] truncate">
            +{formatCurrency(grossProfit)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">{t('purchaseCost')}: {formatCurrency(purchaseCost)}</p>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-3xl border border-orange-200 bg-orange-50/20 p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF7900]">{t('netProfit')}</span>
            <Receipt className="w-5 h-5 text-[#FF7900]" />
          </div>
          <h3 className={`text-xl sm:text-2xl font-black mt-3 font-['Plus_Jakarta_Sans'] truncate ${
            netProfit >= 0 ? 'text-[#171717]' : 'text-[#E5484D]'
          }`}>
            {netProfit >= 0 ? `+${formatCurrency(netProfit)}` : formatCurrency(netProfit)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">{t('operatingExpenses')}: {formatCurrency(totalDayExpenses)}</p>
        </div>
      </div>

      {/* Middle Grid: Detailed Breakdown + Operating Expenses Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Store Performance Breakdown */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-4">
          <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
            {t('reportPerformanceBreakdown')} ({formatDate(selectedDate)})
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">{t('reportSellingRevenue')}</span>
              <span className="font-bold text-[#171717]">{formatCurrency(revenue + discounts)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">{t('reportDiscounts')}</span>
              <span className="font-semibold text-[#E5484D]">-{formatCurrency(discounts)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">{t('reportPurchaseCost')}</span>
              <span className="font-semibold text-[#666666]">-{formatCurrency(purchaseCost)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0] font-bold text-[#171717]">
              <span>{t('reportGrossProfit')} ({revenue > 0 ? Math.round((grossProfit / revenue) * 100) : 0}%):</span>
              <span className="text-emerald-600">+{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">{t('reportOperatingExpensesDeducted')}</span>
              <span className="font-semibold text-[#E5484D]">-{formatCurrency(totalDayExpenses)}</span>
            </div>
            <div className="flex justify-between py-2.5 bg-orange-50/60 px-3 rounded-xl font-bold text-sm text-[#171717]">
              <span>{t('reportNetProfit')}</span>
              <span className={netProfit >= 0 ? "text-emerald-700 font-black" : "text-red-600 font-black"}>
                +{formatCurrency(netProfit)}
              </span>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="pt-3 border-t border-[#EAEAEA]">
            <h4 className="text-xs font-bold text-[#171717] mb-2">{t('reportPaymentSplit')}</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl bg-neutral-50 border border-[#EAEAEA] text-center">
                <span className="text-[11px] font-semibold text-[#888888] block">{t('paymentCard')}</span>
                <span className="text-xs font-bold text-[#171717] mt-0.5 block truncate">
                  {formatCurrency(paymentBreakdown.Card || 0)}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-neutral-50 border border-[#EAEAEA] text-center">
                <span className="text-[11px] font-semibold text-[#888888] block">{t('paymentCash')}</span>
                <span className="text-xs font-bold text-[#171717] mt-0.5 block truncate">
                  {formatCurrency(paymentBreakdown.Cash || 0)}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-neutral-50 border border-[#EAEAEA] text-center">
                <span className="text-[11px] font-semibold text-[#888888] block">{t('paymentTransfer')}</span>
                <span className="text-xs font-bold text-[#171717] mt-0.5 block truncate">
                  {formatCurrency(paymentBreakdown['Bank Transfer'] || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Remaining Inventory status */}
          <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs text-[#888888]">
            <span>{t('reportPhysicalStock')} <strong className="text-[#171717]">{remainingCount} {t('reportUnits')}</strong></span>
            <span>{t('reportValuation')} <strong className="text-[#171717]">{formatCurrency(remainingValue)}</strong></span>
          </div>
        </div>

        {/* Right: Operating Expenses Manager for Selected Day */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                  {t('operatingExpenses')}
                </h3>
                <p className="text-xs text-[#888888]">Do'kon ijarasi, elektr, ishchilar maoshi va bonuslari</p>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('addExpenseBtn')}</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {dayExpenses.length === 0 ? (
                <div className="py-8 text-center text-[#888888] text-xs">
                  {t('reportNoExpenses')}
                </div>
              ) : (
                dayExpenses.map(exp => (
                  <div key={exp.id} className="p-3 rounded-2xl bg-neutral-50 border border-[#EAEAEA] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border text-[#666666]">
                          {exp.category}
                        </span>
                        <h4 className="text-xs font-bold text-[#171717]">{exp.name}</h4>
                      </div>
                      {exp.notes && <p className="text-[11px] text-[#888888] mt-0.5">{exp.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#E5484D]">
                        -{formatCurrency(exp.amount)}
                      </span>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="text-[#888888] hover:text-[#E5484D] transition cursor-pointer"
                        title={t('delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Close Day Button */}
          <div className="pt-4 border-t border-[#EAEAEA] mt-4 flex items-center gap-3">
            <button
              onClick={handleGenerateReport}
              className="flex-1 py-3 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-orange-500/15 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              <span>{existingReport ? "Hisobotni Yangilash" : t('closeDayBtn')}</span>
            </button>
            <button
              onClick={handleCopyTelegramReport}
              className="px-4 py-3 rounded-2xl border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Telegramga Achot Olish"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Previous Daily Reports Archive */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-[#FF7900]" />
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              {t('reportArchivedTitle')}
            </h3>
          </div>
          <span className="text-xs text-[#888888]">
            {dailyReports.length} {t('reportSavedReports')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EAEAEA] text-[#888888]">
                <th className="py-2.5 px-3 font-semibold">{t('date')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('phonesSold')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('statRevenueToday')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('grossProfit')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('operatingExpenses')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('netProfit')}</th>
                <th className="py-2.5 px-3 font-semibold">Top Smartfon</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {dailyReports.map(rep => (
                <tr key={rep.id} className="hover:bg-neutral-50 transition">
                  <td className="py-3 px-3 font-bold text-[#171717]">
                    {formatDate(rep.date)}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#171717]">
                    {rep.phonesSold} {t('reportUnits')}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#171717]">
                    {formatCurrency(rep.revenue)}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-600">
                    +{formatCurrency(rep.grossProfit)}
                  </td>
                  <td className="py-3 px-3 text-[#E5484D]">
                    -{formatCurrency(rep.operatingExpenses)}
                  </td>
                  <td className="py-3 px-3 font-black text-[#171717]">
                    +{formatCurrency(rep.netProfit)}
                  </td>
                  <td className="py-3 px-3 text-[#666666] truncate max-w-[150px]">
                    {rep.bestSellingPhone}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedDate(rep.date)}
                      className="text-xs font-semibold text-[#FF7900] hover:underline cursor-pointer"
                    >
                      {t('reportViewDay')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] mb-1">
              {t('reportAddExpenseTitle')}
            </h3>
            <p className="text-xs text-[#888888] mb-4">
              {formatDate(selectedDate)} sanasi uchun xarajatni kiriting
            </p>

            <form onSubmit={handleCreateExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  {t('reportExpenseCategory')}
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none cursor-pointer"
                >
                  <option value="Rent">Ijara (Rent)</option>
                  <option value="Electricity">Elektr & Kommunal</option>
                  <option value="Salaries">Xodimlar Maoshi & Bonus</option>
                  <option value="Marketing">Marketing & Reklama</option>
                  <option value="Logistics">Yetkazib berish & Logistika</option>
                  <option value="Other">Boshqa xarajatlar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  {t('reportExpenseName')} *
                </label>
                <input
                  type="text"
                  placeholder="masalan: Do'kon ijarasi"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  {t('reportExpenseAmount')} *
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="masalan: 1000000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-bold text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  {t('reportExpenseNotes')}
                </label>
                <input
                  type="text"
                  placeholder="Chek raqami yoki izoh..."
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EAEAEA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666666] hover:bg-neutral-100 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
