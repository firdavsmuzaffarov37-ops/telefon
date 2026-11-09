import React, { useState } from 'react';
import { X, Search, ShieldCheck, AlertCircle, Calendar, Smartphone, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/formatters';

export default function WarrantyModal({ isOpen, onClose }) {
  const { checkWarranty } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = checkWarranty(query.trim());
    setResult(res);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-[#171717] p-1 rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-4 border-b border-[#EAEAEA]">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
              Official IMEI & Warranty Verification
            </h3>
            <p className="text-xs text-[#888888]">Instant hardware warranty status & purchase verification</p>
          </div>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="my-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Enter 15-digit IMEI or Txn ID (e.g. 35489211...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl pl-10 pr-3 py-2 text-xs text-[#171717] font-mono focus:bg-white focus:ring-1 focus:ring-[#FF7900] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold transition shadow-sm"
          >
            Verify
          </button>
        </form>

        {/* Search Result */}
        {searched && (
          <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
            {result ? (
              <div className="space-y-4">
                {/* Status banner */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  result.isValid 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                    : 'bg-red-50/70 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-center gap-3">
                    {result.isValid ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold">
                        {result.isValid ? "Valid Official Warranty Active" : "Warranty Period Expired"}
                      </h4>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        {result.daysRemaining > 0 
                          ? `${result.daysRemaining} days remaining of 12-month coverage` 
                          : "365-day coverage has concluded."}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white shadow-sm">
                    {result.daysRemaining} Days Left
                  </span>
                </div>

                {/* Device Details Card */}
                <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#EAEAEA] space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                    <span className="text-[#888888]">Smartphone Model:</span>
                    <span className="font-bold text-[#171717]">{result.productName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                    <span className="text-[#888888]">Verified IMEI:</span>
                    <span className="font-mono font-bold text-[#171717]">{result.imei}</span>
                  </div>
                  {result.type === 'sold' && (
                    <>
                      <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                        <span className="text-[#888888]">Customer Name:</span>
                        <span className="font-semibold text-[#171717]">{result.customerName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                        <span className="text-[#888888]">Purchase Date:</span>
                        <span className="font-semibold text-[#171717]">{formatDate(result.purchaseDate)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#888888]">Warranty Expires On:</span>
                        <span className="font-bold text-[#171717]">{formatDate(result.warrantyExpiry)}</span>
                      </div>
                    </>
                  )}
                  {result.type === 'inventory' && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#888888]">Stock Status:</span>
                      <span className="font-semibold text-emerald-600">{result.status}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-neutral-50 text-center text-[#888888] text-xs">
                <AlertCircle className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                No smartphone record found for IMEI "{query}". Ensure the 15-digit number is correct.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

