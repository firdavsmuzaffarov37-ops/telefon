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
  CreditCard, 
  Receipt, 
  Plus, 
  Trash2, 
  History,
  Archive,
  AlertCircle
} from 'lucide-react';

export default function DailyReportsPage() {
  const { 
    transactions, 
    products, 
    expenses, 
    addExpense, 
    deleteExpense, 
    dailyReports, 
    closeDayAndGenerateReport 
  } = useApp();
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [reportNotes, setReportNotes] = useState('');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Electricity',
    name: '',
    amount: '',
    notes: ''
  });

  // Calculate stats for the selected date
  const dayTxns = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(selectedDate));
  }, [transactions, selectedDate]);

  const dayExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(selectedDate));
  }, [expenses, selectedDate]);

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

  // Payment Breakdown
  const paymentBreakdown = useMemo(() => {
    const res = { Cash: 0, Card: 0, 'Bank Transfer': 0 };
    dayTxns.forEach(t => {
      if (res[t.paymentMethod] !== undefined) {
        res[t.paymentMethod] += Number(t.revenue);
      } else {
        res[t.paymentMethod] = (res[t.paymentMethod] || 0) + Number(t.revenue);
      }
    });
    return res;
  }, [dayTxns]);

  // Best selling phone & brand for that day
  const bestSellingPhone = useMemo(() => {
    const counts = {};
    dayTxns.forEach(t => {
      counts[t.productName] = (counts[t.productName] || 0) + Number(t.quantity);
    });
    let best = "None sold";
    let max = 0;
    Object.entries(counts).forEach(([name, c]) => {
      if (c > max) {
        max = c;
        best = name;
      }
    });
    return best;
  }, [dayTxns]);

  const bestPerformingBrand = useMemo(() => {
    const revs = {};
    dayTxns.forEach(t => {
      revs[t.brand] = (revs[t.brand] || 0) + Number(t.revenue);
    });
    let best = "None";
    let max = 0;
    Object.entries(revs).forEach(([b, r]) => {
      if (r > max) {
        max = r;
        best = b;
      }
    });
    return best;
  }, [dayTxns]);

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

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <Header
        title={t('reportsTitle')}
        subtitle={t('reportsSubtitle')}
        showDate={false}
        actionText={t('closeDayBtn')}
        actionIcon={CheckCircle2}
        onActionClick={handleGenerateReport}
      />

      {/* Date Selector & Closing Notification */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#FF7900]" />
          <span className="text-xs font-bold text-[#171717]">{t('selectReportDate')}</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs text-[#171717] font-semibold focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
          />
        </div>

        {existingReport ? (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official report generated & archived for this date</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Open day: Not closed yet. Review figures below.</span>
          </div>
        )}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Phones Sold */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">Phones Sold</span>
            <Smartphone className="w-5 h-5 text-[#FF7900]" />
          </div>
          <h3 className="text-2xl font-black text-[#171717] mt-3 font-['Plus_Jakarta_Sans']">
            {phonesSold} <span className="text-xs font-semibold text-[#888888]">units</span>
          </h3>
          <p className="text-xs text-[#888888] mt-1 truncate">Best: {bestSellingPhone}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-[#0284C7]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#171717] mt-3 font-['Plus_Jakarta_Sans'] truncate">
            {formatCurrency(revenue)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">Discounts: {formatCurrency(discounts)}</p>
        </div>

        {/* Gross Profit */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#888888]">Gross Profit</span>
            <TrendingUp className="w-5 h-5 text-[#16A36A]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-3 font-['Plus_Jakarta_Sans'] truncate">
            +{formatCurrency(grossProfit)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">Cost of Goods: {formatCurrency(purchaseCost)}</p>
        </div>

        {/* Net Profit (Separated clearly!) */}
        <div className="bg-white rounded-3xl border border-orange-200 bg-orange-50/20 p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF7900]">Net Profit (After Expenses)</span>
            <Receipt className="w-5 h-5 text-[#FF7900]" />
          </div>
          <h3 className={`text-xl sm:text-2xl font-black mt-3 font-['Plus_Jakarta_Sans'] truncate ${
            netProfit >= 0 ? 'text-[#171717]' : 'text-[#E5484D]'
          }`}>
            {netProfit >= 0 ? `+${formatCurrency(netProfit)}` : formatCurrency(netProfit)}
          </h3>
          <p className="text-xs text-[#888888] mt-1">Expenses: {formatCurrency(totalDayExpenses)}</p>
        </div>
      </div>

      {/* Middle Grid: Detailed Breakdown + Operating Expenses Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Store Performance Breakdown */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card space-y-4">
          <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
            Performance Breakdown ({formatDate(selectedDate)})
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">Total Selling Price Revenue:</span>
              <span className="font-bold text-[#171717]">{formatCurrency(revenue + discounts)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">Total Customer Discounts:</span>
              <span className="font-semibold text-[#E5484D]">-{formatCurrency(discounts)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">Direct Smartphone Purchase Cost:</span>
              <span className="font-semibold text-[#666666]">-{formatCurrency(purchaseCost)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0] font-bold text-[#171717]">
              <span>Gross Profit (Margin {revenue > 0 ? Math.round((grossProfit / revenue) * 100) : 0}%):</span>
              <span className="text-emerald-600">+{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F0F0F0]">
              <span className="text-[#888888]">Operating Expenses Deducted:</span>
              <span className="font-semibold text-[#E5484D]">-{formatCurrency(totalDayExpenses)}</span>
            </div>
            <div className="flex justify-between py-2.5 bg-orange-50/60 px-3 rounded-xl font-bold text-sm text-[#171717]">
              <span>Net Business Profit:</span>
              <span className={netProfit >= 0 ? "text-emerald-700" : "text-red-600"}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="pt-3 border-t border-[#EAEAEA]">
            <h4 className="text-xs font-bold text-[#171717] mb-2">Payment Method Split</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="p-2.5 rounded-2xl bg-neutral-50 border border-[#EAEAEA] text-center">
                  <span className="text-[11px] font-semibold text-[#888888] block">{method}</span>
                  <span className="text-xs font-bold text-[#171717] mt-0.5 block truncate">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining Inventory status */}
          <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs text-[#888888]">
            <span>Remaining Physical Stock: <strong className="text-[#171717]">{remainingCount} units</strong></span>
            <span>Warehouse Valuation: <strong className="text-[#171717]">{formatCurrency(remainingValue)}</strong></span>
          </div>
        </div>

        {/* Right: Operating Expenses Manager for Selected Day */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                  Operating Expenses
                </h3>
                <p className="text-xs text-[#888888]">Rent, electricity, salaries, marketing & utilities</p>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {dayExpenses.length === 0 ? (
                <div className="py-8 text-center text-[#888888] text-xs">
                  No operating expenses logged on {formatDate(selectedDate)}.
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
                        className="text-[#888888] hover:text-[#E5484D] transition"
                        title="Delete expense"
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
          <div className="pt-4 border-t border-[#EAEAEA] mt-4">
            <button
              onClick={handleGenerateReport}
              className="w-full py-3 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-orange-500/15 flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              <span>{existingReport ? 'Re-Generate & Update Report' : 'Close Day & Generate Report'}</span>
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
              Archived Daily Business Reports
            </h3>
          </div>
          <span className="text-xs text-[#888888]">
            {dailyReports.length} saved reports
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EAEAEA] text-[#888888]">
                <th className="py-2.5 px-3 font-semibold">Report Date</th>
                <th className="py-2.5 px-3 font-semibold">Phones Sold</th>
                <th className="py-2.5 px-3 font-semibold">Revenue</th>
                <th className="py-2.5 px-3 font-semibold">Gross Profit</th>
                <th className="py-2.5 px-3 font-semibold">Expenses</th>
                <th className="py-2.5 px-3 font-semibold">Net Profit</th>
                <th className="py-2.5 px-3 font-semibold">Best Seller</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {dailyReports.map(rep => (
                <tr key={rep.id} className="hover:bg-neutral-50 transition">
                  <td className="py-3 px-3 font-bold text-[#171717]">
                    {formatDate(rep.date)}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#171717]">
                    {rep.phonesSold} units
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
                    {formatCurrency(rep.netProfit)}
                  </td>
                  <td className="py-3 px-3 text-[#666666] truncate max-w-[150px]">
                    {rep.bestSellingPhone}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedDate(rep.date)}
                      className="text-xs font-semibold text-[#FF7900] hover:underline"
                    >
                      View Day
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
              Add Operating Expense
            </h3>
            <p className="text-xs text-[#888888] mb-4">
              Record daily overhead for {formatDate(selectedDate)}
            </p>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717]"
                >
                  <option value="Rent">Rent</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Salaries">Employee Salaries</option>
                  <option value="Marketing">Marketing & Ads</option>
                  <option value="Supplies">Store Supplies</option>
                  <option value="Other">Other Expenses</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">Expense Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Navoi Branch Electric Bill"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">Amount (so'm) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1500000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#171717] block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Optional details..."
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717]"
                />
              </div>

              <div className="pt-3 border-t border-[#EAEAEA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666666] hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-xs font-bold text-white shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

