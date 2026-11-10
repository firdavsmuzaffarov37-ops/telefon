import React, { useState, useMemo } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate, getTodayDateString } from '../../utils/formatters';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Building2, 
  Zap, 
  Users, 
  Megaphone, 
  Truck, 
  FileSpreadsheet, 
  Calendar,
  Filter,
  PieChart as PieChartIcon,
  TrendingDown,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Rent', label: 'Do\'kon Ijarasi (Rent)', icon: Building2, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Electricity', label: 'Elektr & Kommunal', icon: Zap, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'Salaries', label: 'Xodimlar Maoshi & Bonus', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Marketing', label: 'Marketing & Reklama', icon: Megaphone, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'Logistics', label: 'Logistika & Kuryer', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Other', label: 'Boshqa xarajatlar', icon: FileSpreadsheet, color: 'text-neutral-600 bg-neutral-100 border-neutral-200' },
];

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, showToast } = useApp();
  const { t } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [newExpense, setNewExpense] = useState({
    category: 'Rent',
    name: '',
    amount: '',
    notes: '',
    date: getTodayDateString()
  });

  // Calculate Statistics
  const todayStr = getTodayDateString();
  const currentMonthStr = todayStr.slice(0, 7); // 'YYYY-MM'

  const todayTotal = useMemo(() => {
    return expenses
      .filter(e => e.date.startsWith(todayStr))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses, todayStr]);

  const monthTotal = useMemo(() => {
    return expenses
      .filter(e => e.date.startsWith(currentMonthStr))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses, currentMonthStr]);

  const allTimeTotal = useMemo(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  // Category breakdown for current month
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(e.amount);
    });

    return CATEGORIES.map(cat => ({
      ...cat,
      total: map[cat.id] || 0,
      percentage: allTimeTotal > 0 ? Math.round(((map[cat.id] || 0) / allTimeTotal) * 100) : 0
    })).sort((a, b) => b.total - a.total);
  }, [expenses, allTimeTotal]);

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
      if (dateFilter && !e.date.startsWith(dateFilter)) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, selectedCategory, dateFilter]);

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name.trim() || !newExpense.amount) {
      showToast('Iltimos, xarajat nomi va summasini kiriting', 'error');
      return;
    }

    addExpense({
      category: newExpense.category,
      name: newExpense.name.trim(),
      amount: Number(newExpense.amount),
      notes: newExpense.notes.trim(),
      date: new Date(`${newExpense.date}T12:00:00`).toISOString()
    });

    setNewExpense({
      category: 'Rent',
      name: '',
      amount: '',
      notes: '',
      date: getTodayDateString()
    });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <Header
        title="Magazin Xarajatlari (Xarajatlar Boshqaruvi)"
        subtitle="Do'kon ijarasi, elektr energiya, xodimlar maoshi, bonuslar va kundalik operatsion xarajatlarni hisoblash"
        showDate={true}
        actionText="Yangi Xarajat Qo'shish"
        actionIcon={Plus}
        onActionClick={() => setIsModalOpen(true)}
      />

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Expenses */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">Bugungi Xarajatlar</span>
            <TrendingDown className="w-5 h-5 text-[#E5484D]" />
          </div>
          <h3 className="text-2xl font-black text-[#E5484D] mt-3 font-['Plus_Jakarta_Sans']">
            -{formatCurrency(todayTotal)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">Sana: {formatDate(todayStr)}</p>
        </div>

        {/* This Month's Expenses */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">Joriy Oylik Xarajat</span>
            <Calendar className="w-5 h-5 text-[#FF7900]" />
          </div>
          <h3 className="text-2xl font-black text-[#171717] mt-3 font-['Plus_Jakarta_Sans']">
            {formatCurrency(monthTotal)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">Oylik sof foydadan chegiriladi</p>
        </div>

        {/* Total All-Time Expenses */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">Jami Qayd Etilgan Xarajat</span>
            <DollarSign className="w-5 h-5 text-[#0284C7]" />
          </div>
          <h3 className="text-2xl font-black text-[#171717] mt-3 font-['Plus_Jakarta_Sans']">
            {formatCurrency(allTimeTotal)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">{expenses.length} ta operatsiya</p>
        </div>

        {/* Top Expense Category */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">Eng Katta Xarajat</span>
            <PieChartIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-[#171717] mt-3 truncate font-['Plus_Jakarta_Sans']">
            {categoryBreakdown[0]?.label.split('(')[0] || '—'}
          </h3>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            {formatCurrency(categoryBreakdown[0]?.total || 0)} ({categoryBreakdown[0]?.percentage || 0}%)
          </p>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-[#FF7900]" />
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Xarajatlarning Toifalar Bo'yicha Taqsimoti
            </h3>
          </div>
          <span className="text-xs text-[#888888]">
            Do'kon operatsion balansi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryBreakdown.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'All' : cat.id)}
                className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                  selectedCategory === cat.id
                    ? 'border-[#FF7900] bg-orange-50/70 shadow-sm ring-1 ring-[#FF7900]'
                    : 'border-[#EAEAEA] bg-neutral-50/60 hover:bg-neutral-100/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#171717] truncate w-full block">
                  {cat.id === 'Rent' ? 'Ijara' :
                   cat.id === 'Electricity' ? 'Elektr' :
                   cat.id === 'Salaries' ? 'Maoshlar' :
                   cat.id === 'Marketing' ? 'Marketing' :
                   cat.id === 'Logistics' ? 'Logistika' : 'Boshqa'}
                </span>
                <span className="text-[11px] font-black text-[#E5484D] mt-1 block">
                  {formatCurrency(cat.total)}
                </span>
                <span className="text-[10px] text-[#888888] font-semibold mt-0.5">
                  {cat.percentage}% ulush
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Table & Filters */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Barcha Qayd Etilgan Xarajatlar Tarixi
            </h3>
            <p className="text-xs text-[#888888]">
              Jami {filteredExpenses.length} ta xarajat topildi
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter by Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-neutral-50 border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#171717] focus:outline-none cursor-pointer"
            >
              <option value="All">Barcha Toifalar</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            {/* Filter by Date */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-neutral-50 border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs text-[#171717] font-semibold focus:outline-none cursor-pointer"
            />

            {(selectedCategory !== 'All' || dateFilter) && (
              <button
                onClick={() => { setSelectedCategory('All'); setDateFilter(''); }}
                className="text-xs text-[#FF7900] hover:underline font-semibold px-2 py-1"
              >
                Filtrlarni tozalash
              </button>
            )}
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="py-12 text-center text-[#888888] text-xs">
            Ushbu filtr bo'yicha hech qanday xarajat topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#888888] bg-neutral-50/70">
                  <th className="py-3 px-3.5 font-bold">Sana</th>
                  <th className="py-3 px-3.5 font-bold">Toifa</th>
                  <th className="py-3 px-3.5 font-bold">Xarajat Nomi</th>
                  <th className="py-3 px-3.5 font-bold">Izoh</th>
                  <th className="py-3 px-3.5 font-bold text-right">Summa</th>
                  <th className="py-3 px-3.5 font-bold text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {filteredExpenses.map((exp) => {
                  const catObj = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[5];
                  return (
                    <tr key={exp.id} className="hover:bg-neutral-50 transition">
                      <td className="py-3 px-3.5 font-semibold text-[#171717]">
                        {formatDate(exp.date)}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catObj.color}`}>
                          {catObj.id}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-[#171717]">
                        {exp.name}
                      </td>
                      <td className="py-3 px-3.5 text-[#888888] truncate max-w-xs">
                        {exp.notes || '—'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-[#E5484D] text-xs">
                        -{formatCurrency(exp.amount)}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="text-[#888888] hover:text-[#E5484D] p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans'] mb-1">
              Yangi Do'kon Xarajati Qo'shish
            </h3>
            <p className="text-xs text-[#888888] mb-4">
              Kiritilgan summa kunlik va oylik sof foydadan avtomatik chegiriladi
            </p>

            <form onSubmit={handleCreateExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  Xarajat Toifasi *
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  Xarajat Nomi *
                </label>
                <input
                  type="text"
                  placeholder="masalan: Noyabr oyi do'kon ijarasi"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  Summa (so'm) *
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="masalan: 1500000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-bold text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  Xarajat Sanasi *
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">
                  Izoh (Chek raqami yoki eslatma)
                </label>
                <input
                  type="text"
                  placeholder="masalan: Chek #4829, to'lov karta orqali"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EAEAEA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666666] hover:bg-neutral-100 cursor-pointer"
                >
                  Bekor qilish
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

