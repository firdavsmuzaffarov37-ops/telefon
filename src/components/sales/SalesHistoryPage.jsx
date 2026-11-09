import React, { useState, useMemo } from 'react';
import Header from '../layout/Header';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  CreditCard, 
  Banknote, 
  Landmark, 
  Calendar, 
  X,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export default function SalesHistoryPage() {
  const { transactions } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Transaction for details modal
  const [viewTxn, setViewTxn] = useState(null);

  // Filter logic
  const filteredTxns = useMemo(() => {
    return transactions.filter(t => {
      // Brand filter
      if (selectedBrand !== 'All' && t.brand !== selectedBrand) return false;

      // Payment filter
      if (selectedPayment !== 'All' && t.paymentMethod !== selectedPayment) return false;

      // Date filter
      if (dateFilter !== 'all') {
        const txnDate = new Date(t.date);
        const now = new Date();
        if (dateFilter === 'today') {
          if (txnDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'week') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          if (txnDate < sevenDaysAgo) return false;
        } else if (dateFilter === 'month') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          if (txnDate < thirtyDaysAgo) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesModel = t.productName.toLowerCase().includes(q);
        const matchesCustomer = t.customerName?.toLowerCase().includes(q);
        const matchesImei = t.imei?.toLowerCase().includes(q);
        if (!matchesId && !matchesModel && !matchesCustomer && !matchesImei) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'revenue_desc') return b.revenue - a.revenue;
      if (sortBy === 'profit_desc') return b.profit - a.profit;
      return 0;
    });
  }, [transactions, selectedBrand, selectedPayment, dateFilter, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredTxns.length / itemsPerPage) || 1;
  const paginatedTxns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTxns.slice(start, start + itemsPerPage);
  }, [filteredTxns, currentPage]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredTxns.length === 0) return;

    const headers = ["Transaction ID", "Date", "Smartphone", "Brand", "Quantity", "Selling Price", "Discount", "Revenue", "Cost", "Gross Profit", "Payment Method", "Customer", "IMEI"];
    const rows = filteredTxns.map(t => [
      t.id,
      t.date,
      `"${t.productName}"`,
      t.brand,
      t.quantity,
      t.sellingPrice,
      t.discount || 0,
      t.revenue,
      t.cost,
      t.profit,
      t.paymentMethod,
      `"${t.customerName}"`,
      `"${t.imei || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `phonelytics-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 md:px-8 py-6 space-y-6">
      <Header
        title="Sales History"
        subtitle="Complete ledger of smartphone retail transactions, receipts, and audit trail."
        actionText="Export CSV"
        actionIcon={Download}
        onActionClick={handleExportCSV}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by TXN, customer, model, IMEI..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-3 py-2 text-xs text-[#171717] focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] font-medium"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] font-medium"
          >
            <option value="All">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Honor">Honor</option>
          </select>

          {/* Payment Method */}
          <select
            value={selectedPayment}
            onChange={(e) => {
              setSelectedPayment(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] font-medium"
          >
            <option value="All">All Payments</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#171717] font-medium"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="revenue_desc">Highest Revenue</option>
            <option value="profit_desc">Highest Profit</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAFAFA] border-b border-[#EAEAEA] text-[#888888]">
              <tr>
                <th className="py-3 px-4 font-semibold">Txn ID</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Smartphone Model</th>
                <th className="py-3 px-4 font-semibold">Qty</th>
                <th className="py-3 px-4 font-semibold">Revenue</th>
                <th className="py-3 px-4 font-semibold">Purchase Cost</th>
                <th className="py-3 px-4 font-semibold">Gross Profit</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {paginatedTxns.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-[#888888]">
                    No sales transactions found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedTxns.map(t => (
                  <tr key={t.id} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#171717]">
                      {t.id}
                    </td>
                    <td className="py-3.5 px-4 text-[#888888]">
                      {formatDateTime(t.date)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#171717]">
                      <div className="flex flex-col">
                        <span>{t.productName}</span>
                        <span className="text-[10px] text-[#888888] font-mono">{t.imei}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#171717]">
                      {t.quantity}x
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#171717]">
                      {formatCurrency(t.revenue)}
                    </td>
                    <td className="py-3.5 px-4 text-[#666666]">
                      {formatCurrency(t.cost)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      +{formatCurrency(t.profit)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 border text-[#171717]">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#666666] truncate max-w-[120px]">
                      {t.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewTxn(t)}
                        className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-neutral-100 text-[#171717] transition"
                        title="View Full Receipt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#EAEAEA] bg-[#FAFAFA] flex items-center justify-between text-xs text-[#888888]">
          <span>
            Showing {Math.min(filteredTxns.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredTxns.length, currentPage * itemsPerPage)} of {filteredTxns.length} records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border bg-white disabled:opacity-40 hover:bg-neutral-100 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-[#171717] px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border bg-white disabled:opacity-40 hover:bg-neutral-100 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {viewTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setViewTxn(null)}
              className="absolute top-4 right-4 text-[#888888] hover:text-[#171717] p-1 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-dashed border-[#EAEAEA]">
              <h3 className="text-lg font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                Transaction Details
              </h3>
              <p className="text-xs font-mono text-[#888888] mt-1">{viewTxn.id}</p>
              <p className="text-xs text-[#666666]">{formatDateTime(viewTxn.date)}</p>
            </div>

            <div className="py-4 space-y-2 text-xs border-b border-dashed border-[#EAEAEA]">
              <div className="flex justify-between font-bold text-[#171717]">
                <span>Product</span>
                <span>{viewTxn.productName}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Hardware IMEI:</span>
                <span className="font-mono text-[#171717]">{viewTxn.imei}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Quantity:</span>
                <span className="text-[#171717]">{viewTxn.quantity} unit(s)</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Unit Purchase Cost:</span>
                <span className="text-[#171717]">{formatCurrency(viewTxn.purchasePrice)}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Unit Selling Price:</span>
                <span className="text-[#171717]">{formatCurrency(viewTxn.sellingPrice)}</span>
              </div>
              {viewTxn.discount > 0 && (
                <div className="flex justify-between text-[#E5484D]">
                  <span>Discount Given:</span>
                  <span>-{formatCurrency(viewTxn.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888888]">
                <span>Payment Mode:</span>
                <span className="font-semibold text-[#171717]">{viewTxn.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Customer:</span>
                <span className="text-[#171717]">{viewTxn.customerName} {viewTxn.customerPhone ? `(${viewTxn.customerPhone})` : ''}</span>
              </div>
              <div className="pt-2 border-t border-[#F0F0F0] flex justify-between text-base font-bold text-[#171717]">
                <span>Total Collected:</span>
                <span className="text-[#FF7900]">{formatCurrency(viewTxn.revenue)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-600">
                <span>Net Gross Margin:</span>
                <span>+{formatCurrency(viewTxn.profit)}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl border border-[#EAEAEA] bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-[#171717] flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setViewTxn(null)}
                className="flex-1 py-2 rounded-xl bg-[#171717] hover:bg-neutral-800 text-xs font-bold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

