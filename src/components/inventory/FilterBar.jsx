import React, { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, X, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function FilterBar({
  selectedBrand,
  setSelectedBrand,
  selectedStorage,
  setSelectedStorage,
  selectedStatus,
  setSelectedStatus,
  priceRange,
  setPriceRange,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  counts = { all: 0, inStock: 0, lowStock: 0, outOfStock: 0 },
  brands = ['All Brands', 'Apple', 'Samsung', 'Xiaomi', 'vivo', 'Google', 'OnePlus', 'realme', 'Honor'],
  storages = ['All Storage', '128GB', '256GB', '512GB', '1TB']
}) {
  const { t } = useLanguage();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Modern category pills (Directly matching reference screenshot)
  const categoryPills = [
    { id: 'All Brands', label: 'Barchasi (All)' },
    { id: 'Apple', label: 'Apple' },
    { id: 'Samsung', label: 'Samsung' },
    { id: 'Xiaomi', label: 'Xiaomi' },
    { id: 'vivo', label: 'vivo' },
    { id: 'Google', label: 'Google Pixel' },
    { id: 'OnePlus', label: 'OnePlus' },
    { id: 'realme', label: 'realme' },
    { id: 'Honor', label: 'Honor' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* 1. Category Pill Row (Horizontal scrollable pill list like reference screenshot) */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-2 flex-nowrap min-w-max">
          {categoryPills.map((pill) => {
            const isSelected = selectedBrand === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedBrand(pill.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-xs ${
                  isSelected
                    ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm scale-[1.02]'
                    : 'bg-[#F5F5F7] dark:bg-[#1C1D24] text-[#666666] dark:text-[#A1A1AA] hover:bg-neutral-200/70 dark:hover:bg-[#252630] hover:text-[#171717] dark:hover:text-white'
                }`}
              >
                {pill.label}
              </button>
            );
          })}

          {/* Quick Hit Savdo Tab */}
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'popular' ? 'newest' : 'popular')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1.5 ${
              sortBy === 'popular'
                ? 'bg-[#FF7900] text-white shadow-sm'
                : 'bg-[#F5F5F7] dark:bg-[#1C1D24] text-[#666666] dark:text-[#A1A1AA] hover:bg-neutral-200/70 dark:hover:bg-[#252630]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eng Ko'p Sotilgan</span>
          </button>
        </div>

        {/* Right: Storage & Sort Dropdowns (All ⌵ from reference) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="appearance-none bg-[#F5F5F7] dark:bg-[#1C1D24] border border-[#EAEAEF] dark:border-[#272832] rounded-2xl pl-3.5 pr-8 py-2 text-xs font-bold text-[#171717] dark:text-white hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF7900] cursor-pointer shadow-xs"
            >
              {storages.map(s => (
                <option key={s} value={s}>{s === 'All Storage' ? 'Xotira: Barchasi' : s}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#F5F5F7] dark:bg-[#1C1D24] border border-[#EAEAEF] dark:border-[#272832] rounded-2xl pl-3.5 pr-8 py-2 text-xs font-bold text-[#171717] dark:text-white hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF7900] cursor-pointer shadow-xs"
            >
              <option value="all">Holat: Barchasi</option>
              <option value="in_stock">Sotuvda mavjud</option>
              <option value="low_stock">5 tadan kam qolgan</option>
              <option value="out_of_stock">Tugagan (0 dona)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`p-2 rounded-2xl border transition cursor-pointer flex items-center justify-center ${
              showMoreFilters
                ? 'bg-[#FF7900] text-white border-[#FF7900]'
                : 'bg-[#F5F5F7] dark:bg-[#1C1D24] text-[#666666] dark:text-[#A1A1AA] border-[#EAEAEF] dark:border-[#272832] hover:text-[#171717]'
            }`}
            title="Qo'shimcha narx filtrlari"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Expandable Advanced Filter Drawer */}
      {showMoreFilters && (
        <div className="p-4 bg-white dark:bg-[#181920] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
          <div>
            <label className="text-xs font-semibold text-[#666666] dark:text-[#A1A1AA] block mb-1.5">
              Maksimal Narx: {Number(priceRange.max).toLocaleString()} so'm
            </label>
            <input
              type="range"
              min="1000000"
              max="25000000"
              step="500000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full accent-[#FF7900] cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <span className="text-xs text-[#888888] font-medium">Tezkor filtr:</span>
            <button
              type="button"
              onClick={() => setPriceRange({ min: 0, max: 7000000 })}
              className="text-xs px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#23242A] hover:bg-neutral-200 text-[#171717] dark:text-white font-medium"
            >
              7 mln gacha
            </button>
            <button
              type="button"
              onClick={() => setPriceRange({ min: 0, max: 15000000 })}
              className="text-xs px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#23242A] hover:bg-neutral-200 text-[#171717] dark:text-white font-medium"
            >
              15 mln gacha
            </button>
          </div>
          <div className="flex items-center justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedBrand('All Brands');
                setSelectedStorage('All Storage');
                setSelectedStatus('all');
                setSearchQuery('');
                setPriceRange({ min: 0, max: 25000000 });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#23242A] hover:bg-red-50 hover:text-red-600 text-xs text-[#666] font-semibold transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Filtrlarni tozalash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
