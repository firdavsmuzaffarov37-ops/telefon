import React, { useState, useMemo } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, DollarSign, Smartphone, PieChart as PieIcon, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const { transactions, products, expenses } = useApp();
  const [period, setPeriod] = useState('7d'); // 'today', 'yesterday', '7d', '30d', 'all'

  // Filter transactions based on selected period
  const filteredTxns = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const d = new Date(t.date);
      if (period === 'today') {
        return d.toDateString() === now.toDateString();
      } else if (period === 'yesterday') {
        const y = new Date();
        y.setDate(now.getDate() - 1);
        return d.toDateString() === y.toDateString();
      } else if (period === '7d') {
        const past = new Date();
        past.setDate(now.getDate() - 7);
        return d >= past;
      } else if (period === '30d') {
        const past = new Date();
        past.setDate(now.getDate() - 30);
        return d >= past;
      }
      return true; // 'all'
    });
  }, [transactions, period]);

  // Aggregate daily metrics
  const timelineData = useMemo(() => {
    const map = {};
    filteredTxns.forEach(t => {
      const day = t.date.split('T')[0];
      if (!map[day]) {
        map[day] = { date: day, revenue: 0, profit: 0, units: 0 };
      }
      map[day].revenue += Number(t.revenue);
      map[day].profit += Number(t.profit);
      map[day].units += Number(t.quantity);
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date)).map(item => ({
      ...item,
      label: item.date.slice(5),
      revMillions: Number((item.revenue / 1000000).toFixed(1)),
      profitMillions: Number((item.profit / 1000000).toFixed(1))
    }));
  }, [filteredTxns]);

  // Brand sales distribution in period
  const brandData = useMemo(() => {
    const map = {};
    filteredTxns.forEach(t => {
      map[t.brand] = (map[t.brand] || 0) + Number(t.revenue);
    });

    const colors = ['#FF7900', '#171717', '#0284C7', '#16A36A', '#9333EA', '#F5A623'];
    return Object.entries(map).map(([brand, rev], idx) => ({
      name: brand,
      value: rev,
      color: colors[idx % colors.length]
    })).sort((a, b) => b.value - a.value);
  }, [filteredTxns]);

  // Payment method distribution in period
  const paymentData = useMemo(() => {
    const map = { Card: 0, Cash: 0, 'Bank Transfer': 0 };
    filteredTxns.forEach(t => {
      map[t.paymentMethod] = (map[t.paymentMethod] || 0) + Number(t.revenue);
    });
    const colors = ['#0284C7', '#16A36A', '#FF7900'];
    return Object.entries(map).map(([method, rev], idx) => ({
      name: method,
      value: rev,
      color: colors[idx]
    }));
  }, [filteredTxns]);

  // Period totals
  const totalRevenue = filteredTxns.reduce((s, t) => s + Number(t.revenue), 0);
  const totalProfit = filteredTxns.reduce((s, t) => s + Number(t.profit), 0);
  const totalUnits = filteredTxns.reduce((s, t) => s + Number(t.quantity), 0);
  const avgOrderValue = filteredTxns.length > 0 ? Math.round(totalRevenue / filteredTxns.length) : 0;

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      <Header
        title="Store Analytics & Intelligence"
        subtitle="Visual insights into revenue trajectory, margin percentages, and product demand."
        showDate={false}
        actionText=""
      />

      {/* Date Range Selector Bar */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-3 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setPeriod(btn.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                period === btn.id
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'text-[#666666] hover:bg-neutral-100'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-[#888888] pr-2">
          {filteredTxns.length} transactions analyzed
        </span>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <span className="text-xs font-semibold text-[#888888]">Period Revenue</span>
          <h3 className="text-xl font-black text-[#171717] mt-2 font-['Plus_Jakarta_Sans'] truncate">
            {formatCurrency(totalRevenue)}
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <span className="text-xs font-semibold text-[#888888]">Gross Profit</span>
          <h3 className="text-xl font-black text-emerald-600 mt-2 font-['Plus_Jakarta_Sans'] truncate">
            +{formatCurrency(totalProfit)}
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <span className="text-xs font-semibold text-[#888888]">Phones Sold</span>
          <h3 className="text-xl font-black text-[#171717] mt-2 font-['Plus_Jakarta_Sans']">
            {totalUnits} <span className="text-xs text-[#888888] font-normal">devices</span>
          </h3>
        </div>

        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <span className="text-xs font-semibold text-[#888888]">Average Order Value</span>
          <h3 className="text-xl font-black text-[#FF7900] mt-2 font-['Plus_Jakarta_Sans'] truncate">
            {formatCurrency(avgOrderValue)}
          </h3>
        </div>
      </div>

      {/* Main Charts: Revenue & Profit Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Area Chart */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card">
          <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] mb-1">
            Revenue & Profit Over Time (Millions so'm)
          </h3>
          <p className="text-xs text-[#888888] mb-4">Financial volume by date</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
                <XAxis dataKey="label" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} unit="M" />
                <Tooltip 
                  formatter={(val, name) => [`${val}M so'm`, name === 'revMillions' ? 'Revenue' : 'Profit']}
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revMillions" stroke="#FF7900" strokeWidth={2} fill="#FF7900" fillOpacity={0.15} />
                <Area type="monotone" dataKey="profitMillions" stroke="#16A36A" strokeWidth={2} fill="#16A36A" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Phones Sold Units Bar Chart */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card">
          <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] mb-1">
            Phones Sold Per Day
          </h3>
          <p className="text-xs text-[#888888] mb-4">Physical unit throughput</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
                <XAxis dataKey="label" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  formatter={(val) => [`${val} phones`, 'Sold']}
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="units" fill="#171717" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Distribution Charts: Brand Share & Payment Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Share */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card">
          <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] mb-1">
            Sales by Brand
          </h3>
          <p className="text-xs text-[#888888] mb-4">Proportion of gross sales</p>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {brandData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card">
          <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] mb-1">
            Payment Methods Distribution
          </h3>
          <p className="text-xs text-[#888888] mb-4">Cash vs Card vs Bank Transfer</p>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

