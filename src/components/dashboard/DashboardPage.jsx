import React, { useMemo } from 'react';
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
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
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
  const { products, transactions, getTodayStats } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const stats = getTodayStats();

  // 1. Calculate 7-day sales and profit trends from real transactions
  const weeklyChartData = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayTxns = transactions.filter(t => t.date.startsWith(dateStr));
      const revenue = dayTxns.reduce((sum, t) => sum + Number(t.revenue), 0);
      const profit = dayTxns.reduce((sum, t) => sum + Number(t.profit), 0);
      const units = dayTxns.reduce((sum, t) => sum + Number(t.quantity), 0);

      days.push({
        date: dateStr,
        day: dayLabel,
        revenue: Math.round(revenue / 1000000), // in Millions so'm for clean axis
        rawRevenue: revenue,
        profit: Math.round(profit / 1000000),
        rawProfit: profit,
        units
      });
    }
    return days;
  }, [transactions]);

  // 2. Brand Sales Distribution
  const brandDistribution = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      map[t.brand] = (map[t.brand] || 0) + Number(t.revenue);
    });

    const colors = ['#FF7900', '#171717', '#0284C7', '#16A36A', '#9333EA', '#F5A623'];
    return Object.entries(map).map(([brand, rev], idx) => ({
      name: brand,
      value: rev,
      formatted: formatCurrency(rev),
      color: colors[idx % colors.length]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 3. Best-Selling Smartphones
  const bestSellers = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (!map[t.productId]) {
        map[t.productId] = {
          id: t.productId,
          name: t.productName,
          brand: t.brand,
          units: 0,
          revenue: 0
        };
      }
      map[t.productId].units += Number(t.quantity);
      map[t.productId].revenue += Number(t.revenue);
    });

    return Object.values(map)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5)
      .map(item => {
        const product = products.find(p => p.id === item.id);
        return {
          ...item,
          image: product?.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
          stock: product ? product.stock : 0
        };
      });
  }, [transactions, products]);

  // 4. Low stock items
  const lowStockItems = useMemo(() => {
    return products
      .filter(p => p.stock <= (p.minStockThreshold || 5))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 4);
  }, [products]);

  // 5. Recent transactions
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Dashboard Welcome Header */}
      <Header
        title={t('goodMorning')}
        subtitle={t('dashboardSubtitle')}
        actionText={t('openPOSBtn')}
        actionIcon={ShoppingCart}
        onActionClick={() => navigate('/pos')}
      />

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Phones Sold Today */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">{t('statSoldToday')}</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF7900] flex items-center justify-center">
              <Smartphone className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#171717] tracking-tight font-['Plus_Jakarta_Sans']">
              {stats.phonesSoldToday} <span className="text-sm font-semibold text-[#888888]">devices</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              {stats.soldGrowth >= 0 ? (
                <span className="text-emerald-600 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{stats.soldGrowth}%
                </span>
              ) : (
                <span className="text-red-600 font-bold flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {stats.soldGrowth}%
                </span>
              )}
              <span className="text-[#888888]">{t('vsYesterday')} ({stats.phonesSoldYesterday})</span>
            </div>
          </div>
        </div>

        {/* Card 2: Revenue Today */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">{t('statRevenueToday')}</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
              <DollarSign className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight font-['Plus_Jakarta_Sans'] truncate">
              {formatCurrency(stats.revenueToday)}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              {stats.revGrowth >= 0 ? (
                <span className="text-emerald-600 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{stats.revGrowth}%
                </span>
              ) : (
                <span className="text-red-600 font-bold flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {stats.revGrowth}%
                </span>
              )}
              <span className="text-[#888888]">{t('vsYesterday')}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Gross Profit Today */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">{t('statProfitToday')}</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight font-['Plus_Jakarta_Sans'] truncate">
              +{formatCurrency(stats.profitToday)}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-[#888888]">{t('grossMargin')}:</span>
              <span className="font-bold text-[#171717]">
                {stats.revenueToday > 0 ? Math.round((stats.profitToday / stats.revenueToday) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Remaining Stock */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">{t('statStockCount')}</span>
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-[#171717] flex items-center justify-center">
              <Package className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#171717] tracking-tight font-['Plus_Jakarta_Sans']">
              {stats.totalStock} <span className="text-sm font-semibold text-[#888888]">{t('unitsInStore')}</span>
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-[#888888]">Valuation:</span>
              <span className="font-bold text-[#171717]">{formatCurrency(stats.totalInventoryValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Revenue & Profit Trends (7 Days) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 7-Day Revenue & Profit Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                Revenue & Profit Trend (Last 7 Days)
              </h3>
              <p className="text-xs text-[#888888]">Daily financial performance in Millions so'm</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF7900]" />
                <span className="text-[#171717]">Revenue (M)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#16A36A]" />
                <span className="text-[#171717]">Profit (M)</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7900" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#FF7900" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A36A" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#16A36A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} unit="M" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#FFF', 
                    fontSize: '12px' 
                  }}
                  formatter={(value, name) => [`${value}M so'm`, name === 'revenue' ? 'Revenue' : 'Profit']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF7900" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#16A36A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Brand Sales Share (1 col) */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Brand Sales Distribution
            </h3>
            <p className="text-xs text-[#888888]">Revenue generated by manufacturer</p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {brandDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => formatCurrency(val)} 
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Brand Legend list */}
          <div className="space-y-1.5 pt-2 border-t border-[#F0F0F0]">
            {brandDistribution.map(b => (
              <div key={b.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="font-semibold text-[#171717]">{b.name}</span>
                </div>
                <span className="text-[#666666] font-medium">{b.formatted}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Best Sellers, Low Stock, Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Best-Selling Smartphones */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                Best-Selling Phones
              </h3>
              <p className="text-xs text-[#888888]">Top performers by unit volume</p>
            </div>
            <span className="text-xs font-semibold text-[#FF7900] bg-orange-50 px-2.5 py-1 rounded-full">
              Top 5
            </span>
          </div>

          <div className="space-y-3">
            {bestSellers.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition border border-[#F5F5F4]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-neutral-100 text-[#171717] text-xs font-bold flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-neutral-50 p-1" />
                  <div>
                    <h4 className="text-xs font-bold text-[#171717] line-clamp-1">{item.name}</h4>
                    <span className="text-[11px] text-[#888888]">{item.units} sold</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#171717] block">{formatCurrency(item.revenue)}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{item.stock} in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Low Stock Warning</span>
                </h3>
                <p className="text-xs text-[#888888]">Phones that need immediate restocking</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {lowStockItems.length} items
              </span>
            </div>

            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-[#888888] text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All smartphones are sufficiently stocked!
                </div>
              ) : (
                lowStockItems.map(phone => (
                  <div key={phone.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                    <div className="flex items-center gap-2.5">
                      <img src={phone.image} alt={phone.name} className="w-9 h-9 object-contain rounded-lg bg-white p-1" />
                      <div>
                        <h4 className="text-xs font-bold text-[#171717] line-clamp-1">{phone.name}</h4>
                        <span className="text-[10px] text-amber-800 font-semibold">
                          Only {phone.stock} left in stock
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/')}
                      className="text-[11px] font-bold text-[#FF7900] hover:text-[#EA6E00] px-2.5 py-1 rounded-lg bg-white border border-orange-200 transition"
                    >
                      Restock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-2 text-xs font-semibold text-[#171717] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition text-center"
          >
            View Full Inventory
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF7900]" />
                  <span>Recent Sales</span>
                </h3>
                <p className="text-xs text-[#888888]">Latest counter transactions</p>
              </div>
              <button
                onClick={() => navigate('/history')}
                className="text-xs font-semibold text-[#FF7900] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-neutral-50 transition border border-[#F5F5F4]">
                  <div>
                    <h4 className="text-xs font-bold text-[#171717] line-clamp-1">{t.productName}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-[#888888] mt-0.5">
                      <span>{t.paymentMethod}</span>
                      <span>•</span>
                      <span>{t.customerName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#171717] block">{formatCurrency(t.revenue)}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">+{formatCurrency(t.profit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/pos')}
            className="w-full mt-4 py-2 text-xs font-bold text-white bg-[#FF7900] hover:bg-[#EA6E00] rounded-xl transition text-center shadow-md shadow-orange-500/10"
          >
            Open POS Register
      