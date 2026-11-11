import React, { useState, useMemo } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { 
  Smartphone, 
  DollarSign, 
  TrendingUp, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Sparkles,
  Award,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Tag,
  Star,
  Flame,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { 
    products, 
    transactions, 
    getTodayStats, 
    restockProduct, 
    showToast,
    staffMembers,
    activeCashier,
    selectActiveCashier 
  } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 1. Time Period Selector: Kunlik (Bugun), Haftalik (7 kun), Oylik (30 kun)
  const [selectedPeriod, setSelectedPeriod] = useState('today'); // 'today' | 'week' | 'month'

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter transactions for the selected period
  const periodTransactions = useMemo(() => {
    const now = new Date();
    if (selectedPeriod === 'today') {
      return transactions.filter(t => t.date.startsWith(todayStr));
    }
    if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      return transactions.filter(t => new Date(t.date) >= weekAgo);
    }
    if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      return transactions.filter(t => new Date(t.date) >= monthAgo);
    }
    return transactions;
  }, [transactions, selectedPeriod, todayStr]);

  // 2. Core Aggregated KPI Stats
  // A. Bugun nechta telefon sotilgani
  const phonesSoldToday = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(todayStr))
      .reduce((sum, t) => sum + Number(t.quantity), 0);
  }, [transactions, todayStr]);

  // B. Tanlangan davrda sotilgan telefonlar soni
  const periodUnitsSold = useMemo(() => {
    return periodTransactions.reduce((sum, t) => sum + Number(t.quantity), 0);
  }, [periodTransactions]);

  // C. Umumiy tushum va sof foyda
  const periodRevenue = useMemo(() => {
    return periodTransactions.reduce((sum, t) => sum + Number(t.revenue), 0);
  }, [periodTransactions]);

  const periodProfit = useMemo(() => {
    return periodTransactions.reduce((sum, t) => sum + Number(t.profit), 0);
  }, [periodTransactions]);

  const profitMarginPct = periodRevenue > 0 ? Math.round((periodProfit / periodRevenue) * 100) : 0;

  // D. Omborda qolgan telefonlar soni va jami ombor qiymati
  const totalStockCount = useMemo(() => {
    return products.reduce((sum, p) => sum + Number(p.stock), 0);
  }, [products]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.stock) * Number(p.sellingPrice)), 0);
  }, [products]);

  // 3. Dynamic Chart Trajectory (Kunlik / Haftalik / Oylik egri chiziq)
  const trajectoryChartData = useMemo(() => {
    const daysCount = selectedPeriod === 'today' ? 1 : selectedPeriod === 'week' ? 7 : 14;
    const days = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = selectedPeriod === 'today' 
        ? "Bugun" 
        : d.toLocaleDateString('uz-UZ', { weekday: 'short', day: 'numeric' });

      const dayTxns = transactions.filter(t => t.date.startsWith(dateStr));
      const revenue = dayTxns.reduce((sum, t) => sum + Number(t.revenue), 0);
      const profit = dayTxns.reduce((sum, t) => sum + Number(t.profit), 0);
      const units = dayTxns.reduce((sum, t) => sum + Number(t.quantity), 0);

      days.push({
        date: dateStr,
        day: dayLabel,
        revenue: Math.round(revenue / 1000000), // in Millions
        rawRevenue: revenue,
        profit: Math.round(profit / 1000000),
        rawProfit: profit,
        units
      });
    }
    return days;
  }, [transactions, selectedPeriod]);

  // 4. TOP 5 Eng Ko'p Sotilgan Telefonlar (Rank 1 to 5)
  const top5BestSellers = useMemo(() => {
    const map = {};
    periodTransactions.forEach(t => {
      if (!map[t.productId]) {
        map[t.productId] = {
          id: t.productId,
          name: t.productName,
          brand: t.brand,
          units: 0,
          revenue: 0,
          profit: 0
        };
      }
      map[t.productId].units += Number(t.quantity);
      map[t.productId].revenue += Number(t.revenue);
      map[t.productId].profit += Number(t.profit);
    });

    return Object.values(map)
      .sort((a, b) => b.units - a.units || b.revenue - a.revenue)
      .slice(0, 5)
      .map(item => {
        const prod = products.find(p => p.id === item.id);
        return {
          ...item,
          image: prod?.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
          stock: prod ? prod.stock : 0,
          storage: prod?.storage || ''
        };
      });
  }, [periodTransactions, products]);

  // 5. Eng Kam Sotilayotgan Telefonlar (Sust sotuv / harakatsiz smartfonlar)
  const slowMovingPhones = useMemo(() => {
    // Check sales count in current period for each phone
    const salesCountMap = {};
    periodTransactions.forEach(t => {
      salesCountMap[t.productId] = (salesCountMap[t.productId] || 0) + Number(t.quantity);
    });

    // Find phones with lowest or 0 sales in the period
    return products
      .map(p => ({
        ...p,
        periodSales: salesCountMap[p.id] || 0
      }))
      .sort((a, b) => a.periodSales - b.periodSales || b.stock - a.stock)
      .slice(0, 4);
  }, [products, periodTransactions]);

  // 6. Omborda Tugayotgan Telefonlar Haqida Ogohlantirish (Low Stock Alert)
  const lowStockAlerts = useMemo(() => {
    return products
      .filter(p => p.stock <= (p.minStockThreshold || 5))
      .sort((a, b) => a.stock - b.stock);
  }, [products]);

  // 7. Har Bir Ishchining Savdo Natijalari (Employee Sales Performance)
  const employeePerformance = useMemo(() => {
    const staffMap = {};

    // Standard staff members list from context
    const currentStaff = staffMembers || [
      { name: "Sardor Rahimov", role: "Katta Sotuvchi", avatar: "SR", target: 15 },
      { name: "Malika Karimova", role: "Sotuvchi-Maslahatchi", avatar: "MK", target: 12 },
      { name: "Jasur Alimov", role: "Kassir-Operator", avatar: "JA", target: 10 },
      { name: "Sherzod Xodiyev", role: "Do'kon Menejeri", avatar: "SX", target: 8 }
    ];

    currentStaff.forEach(s => {
      staffMap[s.name] = {
        name: s.name,
        role: s.role,
        avatar: s.avatar,
        target: s.target || 10,
        units: 0,
        revenue: 0,
        profit: 0
      };
    });

    periodTransactions.forEach(t => {
      const cName = t.cashierName || "Sardor Rahimov";
      if (!staffMap[cName]) {
        staffMap[cName] = {
          name: cName,
          role: t.cashierRole || "Sotuvchi",
          avatar: cName.slice(0, 2).toUpperCase(),
          target: 10,
          units: 0,
          revenue: 0,
          profit: 0
        };
      }
      staffMap[cName].units += Number(t.quantity);
      staffMap[cName].revenue += Number(t.revenue);
      staffMap[cName].profit += Number(t.profit);
    });

    return Object.values(staffMap).sort((a, b) => b.revenue - a.revenue);
  }, [periodTransactions, staffMembers]);

  // Quick Restock handler
  const handleQuickRestock = (phone) => {
    const qty = prompt(`"${phone.name}" omborini necha dona to'ldirmoqchisiz?`, "10");
    if (qty && !isNaN(qty) && Number(qty) > 0) {
      restockProduct(phone.id, Number(qty));
      showToast(`${phone.name} zaxirasi +${qty} donaga to'ldirildi!`, 'success');
    }
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-7 animate-in fade-in duration-300">
      {/* 1. Header & Period Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#EAEAEA] dark:border-[#27282E]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Do'kon Boshqaruv Paneli & Tahlili
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Smartfonlar ombori, kunlik tushum, sof foyda va ishchilar savdo reytingi.
          </p>
        </div>

        {/* Kunlik, Haftalik va Oylik tanlagich */}
        <div className="flex items-center gap-2 self-start lg:self-auto bg-[#F5F5F4] dark:bg-[#18191D] p-1.5 rounded-2xl border border-[#EAEAEA] dark:border-[#27282E]">
          <button
            onClick={() => setSelectedPeriod('today')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedPeriod === 'today'
                ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                : 'text-[#666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Kunlik (Bugun)</span>
          </button>

          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedPeriod === 'week'
                ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                : 'text-[#666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Haftalik (7 Kun)</span>
          </button>

          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedPeriod === 'month'
                ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                : 'text-[#666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Oylik (30 Kun)</span>
          </button>
        </div>
      </div>

      {/* 2. Urgent Low Stock Banner (Omborda tugayotgan telefonlar haqida ogohlantirish) */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-700/50 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-amber-950 dark:text-amber-200">
                  Omborda Tugayotgan Smartfonlar Ogohlantirishi!
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-black">
                  {lowStockAlerts.length} ta model
                </span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5">
                Quyidagi modellarning zaxirasi chegaradan (5 dona) kam qolgan: {lowStockAlerts.slice(0, 3).map(p => `${p.name} (${p.stock} dona)`).join(', ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>Omborni To'ldirish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. The 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Bugun Sotilgan Telefonlar */}
        <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-5 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#888888] uppercase tracking-wider">
              {selectedPeriod === 'today' ? "Bugun Sotildi" : "Davrda Sotildi"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF7900] flex items-center justify-center">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-[#171717] dark:text-white tracking-tight">
                {selectedPeriod === 'today' ? phonesSoldToday : periodUnitsSold}
              </h3>
              <span className="text-sm font-bold text-[#888888]">dona telefon</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>Bugun: {phonesSoldToday} ta smartfon</span>
            </p>
          </div>
        </div>

        {/* Card 2: Omborda Qolgan Telefonlar Soni */}
        <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-5 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#888888] uppercase tracking-wider">
              Omborda Qolgan Zaxira
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0284C7] flex items-center justify-center">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-[#171717] dark:text-white tracking-tight">
                {totalStockCount}
              </h3>
              <span className="text-sm font-bold text-[#888888]">dona zaxira</span>
            </div>
            <p className="text-xs text-[#888888] font-medium mt-2 truncate" title={formatCurrency(totalInventoryValue)}>
              Qiymati: <strong className="text-[#171717] dark:text-white">{formatCurrency(totalInventoryValue)}</strong>
            </p>
          </div>
        </div>

        {/* Card 3: Umumiy Tushum */}
        <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-5 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#888888] uppercase tracking-wider">
              Umumiy Tushum ({selectedPeriod === 'today' ? 'Bugun' : selectedPeriod === 'week' ? '7 Kun' : 'Oylik'})
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white tracking-tight truncate" title={formatCurrency(periodRevenue)}>
              {formatCurrency(periodRevenue)}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>Savdo faoliyati a'lo</span>
            </p>
          </div>
        </div>

        {/* Card 4: Sof Foyda */}
        <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-5 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#888888] uppercase tracking-wider">
              Sof Foyda (Marja bilan)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-[#FF7900] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-[#FF7900] tracking-tight truncate" title={formatCurrency(periodProfit)}>
              +{formatCurrency(periodProfit)}
            </h3>
            <p className="text-xs text-[#888888] font-medium mt-2">
              Sof Marja: <strong className="text-emerald-600 dark:text-emerald-400 font-black">{profitMarginPct}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 4. Sales Trajectory Chart */}
      <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
              Savdo Tushumi va Sof Foyda Dinamikasi
            </h3>
            <p className="text-xs text-[#888888] mt-0.5">
              Tanlangan davr bo'yicha tushum va foyda o'sish egri chizig'i (Mln so'mda)
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF7900]" />
              <span className="text-[#171717] dark:text-white">Umumiy Tushum</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-[#171717] dark:text-white">Sof Foyda</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7900" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#FF7900" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" opacity={0.5} vertical={false} />
              <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} unit="M" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#171717', 
                  borderRadius: '16px', 
                  border: 'none', 
                  color: '#FFF', 
                  fontSize: '12px' 
                }}
                formatter={(value, name) => [`${value}M so'm`, name === 'revenue' ? "Umumiy Tushum" : "Sof Foyda"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF7900" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProf)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Two Columns: TOP 5 Eng Ko'p Sotilganlar VS Eng Kam Sotilayotganlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: TOP 5 Eng Ko'p Sotilgan Telefonlar */}
        <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA] dark:border-[#27282E] mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF7900]" />
                <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
                  Eng Ko'p Sotilgan Telefonlar (TOP 5)
                </h3>
              </div>
              <p className="text-xs text-[#888888] mt-0.5">Eng yuqori talabga ega bestseller flagmanlar</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7900] text-xs font-bold">
              Yetakchilar
            </span>
          </div>

          <div className="space-y-3">
            {top5BestSellers.map((item, idx) => {
              const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-[#202127]/60 border border-[#EAEAEA]/80 dark:border-[#2E2F37] hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-white dark:bg-[#18191D] flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                      {medal}
                    </span>
                    <img src={item.image} alt={item.name} className="w-11 h-11 object-contain rounded-xl bg-white dark:bg-[#18191D] p-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#171717] dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#888888] font-medium">
                        {item.units} dona sotildi • <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.stock} ta omborda</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <span className="text-xs sm:text-sm font-black text-[#171717] dark:text-white block">
                      {formatCurrency(item.revenue)}
                    </span>
                    <span className="text-[11px] font-bold text-[#FF7900]">
                      +{formatCurrency(item.profit)} foyda
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Eng Kam Sotilayotgan Telefonlar (Sust Modellar) */}
        <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA] dark:border-[#27282E] mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                  <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
                    Eng Kam Sotilayotgan Telefonlar
                  </h3>
                </div>
                <p className="text-xs text-[#888888] mt-0.5">Omborda uzoq turib qolgan yoki sust sotilayotgan modellar</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold">
                E'tibor Talab
              </span>
            </div>

            <div className="space-y-3">
              {slowMovingPhones.map((phone) => (
                <div 
                  key={phone.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-[#202127]/60 border border-[#EAEAEA]/80 dark:border-[#2E2F37]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={phone.image} alt={phone.name} className="w-11 h-11 object-contain rounded-xl bg-white dark:bg-[#18191D] p-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#171717] dark:text-white truncate">
                        {phone.name}
                      </h4>
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                        Bu davrda faqat {phone.periodSales} ta sotildi • Omborda: {phone.stock} dona
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <span className="text-xs font-bold text-[#171717] dark:text-white block">
                      {formatCurrency(phone.sellingPrice)}
                    </span>
                    <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/50 text-[#FF7900]">
                      Aksiya / Chegirma tavsiya
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/40 text-xs text-[#666] dark:text-[#A1A1AA] flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#FF7900] flex-shrink-0" />
            <span>
              <strong>AI Maslahat:</strong> Kam sotilayotgan smartfonlarga 5-10% aksiya qo'yish yoki vitrinaning markaziga chiqarish ularning aylanishini 3 baravargacha tezlashtiradi.
            </span>
          </div>
        </div>
      </div>

      {/* 6. Har Bir Ishchining Savdo Natijalari (Staff Performance Leaderboard) */}
      <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAEAEA] dark:border-[#27282E] gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF7900]" />
              <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
                Har Bir Ishchining Savdo Natijalari
              </h3>
            </div>
            <p className="text-xs text-[#888888] mt-0.5">
              Istalgan xodimni bosib tanlang va uning nomidan yangi telefon sotuvini amalga oshiring
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF7900] border border-orange-200 dark:border-orange-900/50 flex items-center gap-1.5">
              <span>Hozirgi faol:</span>
              <strong className="font-bold">{activeCashier?.name || 'Sardor Rahimov'}</strong>
            </span>
            <button
              onClick={() => navigate(`/pos?cashier=${encodeURIComponent(activeCashier?.name || 'Sardor Rahimov')}`)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>POS da Sotish</span>
            </button>
          </div>
        </div>

        {/* Staff Cards Grid - Har bir ishchini tanlash va telefon sotish imkoniyati */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {employeePerformance.map((emp, index) => {
            const isLeader = index === 0 && emp.units > 0;
            const isSelected = activeCashier?.name === emp.name;
            const progressPct = Math.min(100, Math.round((emp.units / emp.target) * 100));

            return (
              <div
                key={emp.name}
                onClick={() => selectActiveCashier(emp)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                  isSelected
                    ? 'border-[#FF7900] ring-2 ring-[#FF7900]/30 bg-orange-50/20 dark:bg-orange-950/15 shadow-md'
                    : isLeader
                      ? 'bg-gradient-to-b from-orange-50/70 to-white dark:from-orange-950/20 dark:to-[#18191D] border-orange-300 dark:border-orange-800 shadow-sm'
                      : 'bg-white dark:bg-[#18191D] border-[#EAEAEA] dark:border-[#27282E] hover:border-neutral-300'
                }`}
              >
                <div>
                  {/* Employee Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                        isSelected || isLeader
                          ? 'bg-[#FF7900] text-white ring-2 ring-orange-200' 
                          : 'bg-neutral-100 dark:bg-[#25262C] text-[#171717] dark:text-white'
                      }`}>
                        {emp.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#171717] dark:text-white line-clamp-1">
                          {emp.name}
                        </h4>
                        <span className="text-[11px] text-[#888888] font-medium block">
                          {emp.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isLeader && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black flex items-center gap-1 shadow-xs">
                          <Award className="w-3 h-3 text-[#FF7900]" />
                          TOP 1
                        </span>
                      )}
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF7900] text-white text-[9.5px] font-bold shadow-xs">
                          ✓ Faol
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="mt-5 space-y-2.5 pt-4 border-t border-[#F0F0F0] dark:border-[#27282E] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#888888]">Sotilgan telefonlar:</span>
                      <span className="font-black text-[#171717] dark:text-white text-sm">
                        {emp.units} dona
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#888888]">Jami Savdo Tushumi:</span>
                      <span className="font-bold text-[#171717] dark:text-white">
                        {formatCurrency(emp.revenue)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#888888]">Keltirilgan Sof Foyda:</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(emp.profit)}
                      </span>
                    </div>
                  </div>

                  {/* Target Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-[#F0F0F0] dark:border-[#27282E]">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-[#888888] font-medium">Reja bajarilishi:</span>
                      <span className="font-bold text-[#171717] dark:text-white">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-[#25262C] overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected || isLeader ? 'bg-[#FF7900]' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Telefon Sotish Tugmasi (Har bir xodim nomidan sotish) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectActiveCashier(emp);
                    navigate(`/pos?cashier=${encodeURIComponent(emp.name)}`);
                  }}
                  className={`w-full mt-4 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-[#FF7900] hover:bg-[#EA6E00] text-white shadow-orange-500/20'
                      : 'bg-neutral-100 dark:bg-[#23242A] hover:bg-[#FF7900] hover:text-white text-[#171717] dark:text-white'
                  }`}
                  title={`${emp.name} nomidan telefon sotish`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{emp.name.split(' ')[0]} nomidan sotish</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}