import React, { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
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
  brands = ['All Brands', 'Apple', 'Samsung', 'Xiaomi', 'Honor', 'Google'],
  storages = ['All Storage', '128GB', '256GB', '512GB']
}) {
  const { t } = useLanguage();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const tabs = [
    { id: 'all', label: t('allProductsTab'), count: counts.all },
    { id: 'in_stock', label: t('inStockTab'), count: counts.inStock },
    { id: 'low_stock', label: t('lowStockTab'), count: counts.lowStock },
    { id: 'out_of_stock', label: t('outOfStockTab'), count: counts.outOfStock },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Filter Dropdown Row (Matching reference screenshot) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Dropdown */}
        <div className="relative min-w-[140px] flex-1 sm:flex-none">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-xl px-3.5 py-2 text-xs font-medium text-[#171717] pr-8 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF7900] shadow-sm cursor-pointer"
          >
            <option value="all">{t('filterStatus')}</option>
            <option value="in_stock">{t('inStockTab')}</option>
            <option value="low_stock">{t('lowStockTab')}</option>
            <option value="out_of_stock">{t('outOfStockTab')}</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Brand Dropdown */}
        <div className="relative min-w-[140px] flex-1 sm:flex-none">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-xl px-3.5 py-2 text-xs font-medium text-[#171717] pr-8 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF7900] shadow-sm cursor-pointer"
          >
            {brands.map(b => (
              <option key={b} value={b}>{b === 'All Brands' ? t('filterBrand') : b}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Storage Capacity Dropdown */}
        <div className="relative min-w-[140px] flex-1 sm:flex-none">
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-xl px-3.5 py-2 text-xs font-medium text-[#171717] pr-8 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF7900] shadow-sm cursor-pointer"
          >
            {storages.map(s => (
              <option key={s} value={s}>{s === 'All Storage' ? t('filterStorage') : s}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* More Filters Toggle Pill */}
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
            showMoreFilters
              ? 'bg-[#FF7900] text-white shadow-sm'
              : 'bg-[#171717] text-white hover:bg-neutral-800'
          }`}
        >
          <span>{t('moreFilters')}</span>
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Reset active filters if any are set */}
        {(selectedBrand !== 'All Brands' || selectedStorage !== 'All Storage' || selectedStatus !== 'all' || searchQuery || priceRange.max < 25000000) && (
          <button
            onClick={() => {
              setSelectedBrand('All Brands');
              setSelectedStorage('All Storage');
              setSelectedStatus('all');
              setSearchQuery('');
              setPriceRange({ min: 0, max: 25000000 });
            }}
            className="flex items-center gap-1 text-xs text-[#888888] hover:text-[#E5484D] px-2 py-1 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t('resetFilters')}</span>
          </button>
        )}
      </div>

      {/* Expandable More Filters Panel */}
      {showMoreFilters && (
        <div className="p-4 bg-white rounded-2xl border border-[#EAEAEA] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
          <div>
            <label className="text-xs font-semibold text-[#666666] block mb-1.5">
              {t('maxPrice')}: {Number(priceRange.max).toLocaleString()} so'm
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
            <span className="text-xs text-[#888888] font-medium">Tezkor:</span>
            <button
              onClick={() => setPriceRange({ min: 0, max: 5000000 })}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#171717] font-medium"
            >
              5 mln gacha
            </button>
            <button
              onClick={() => setPriceRange({ min: 0, max: 15000000 })}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#171717] font-medium"
            >
              15 mln gacha
            </button>
          </div>
        </div>
      )}

      {/* Tabs and Search / Sort Row (Matching reference screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-[#EAEAEA]">
        {/* Tabs */}
        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-xs md:text-sm font-semibold tracking-tight transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'text-[#171717]'
                    : 'text-[#888888] hover:text-[#171717]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-1.5 text-xs ${isActive ? 'text-[#171717]' : 'text-[#888888]'}`}>
                  ({tab.count})
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#171717] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 pb-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EAEAEA] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#171717] placeholder:text-[#888888] hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF7900] shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#171717]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs font-medium text-[#171717] pr-7 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF7900] shadow-sm cursor-pointer"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="price_low">{t('sortPriceLow')}</option>
              <option value="price_high">{t('sortPriceHigh')}</option>
              <option value="stock_low">{t('sortStockLow')}</option>
              <option value="popular">{t('sortPopular')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

