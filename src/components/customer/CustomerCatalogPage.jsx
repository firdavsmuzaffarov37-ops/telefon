import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Eye, 
  Star, 
  Check, 
  SlidersHorizontal,
  Smartphone,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCustomer } from '../../context/CustomerContext';
import { formatCurrency } from '../../utils/formatters';

const BRANDS = ['Barchasi', 'Apple', 'Samsung', 'Xiaomi', 'Honor', 'Google'];

export default function CustomerCatalogPage() {
  const { products } = useApp();
  const { addToCart } = useCustomer();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const brandParam = searchParams.get('brand') || 'Barchasi';
  const searchParam = searchParams.get('search') || '';

  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedStorage, setSelectedStorage] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000000);
  const [sortBy, setSortBy] = useState('popular');

  // Filter products
  const filtered = useMemo(() => {
    return products.filter(p => {
      // Brand filter
      if (selectedBrand !== 'Barchasi' && !p.brand.toLowerCase().includes(selectedBrand.toLowerCase())) {
        return false;
      }
      // Storage filter
      if (selectedStorage !== 'All' && p.storage !== selectedStorage) {
        return false;
      }
      // Price filter
      if (Number(p.sellingPrice) > maxPrice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return Number(a.sellingPrice) - Number(b.sellingPrice);
      if (sortBy === 'price_high') return Number(b.sellingPrice) - Number(a.sellingPrice);
      return (b.unitsSold || 0) - (a.unitsSold || 0);
    });
  }, [products, selectedBrand, selectedStorage, maxPrice, searchQuery, sortBy]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#171717] dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Smartfonlar Katalogi
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1">
            Barcha original Apple, Samsung, Xiaomi, Honor va boshqa flagman telefonlar
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Model yoki brend bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:ring-1 focus:ring-[#FF7900] focus:outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Brand Tabs (iPhone, Samsung, Xiaomi, Redmi, Honor, Google) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {BRANDS.map(b => (
          <button
            key={b}
            onClick={() => { setSelectedBrand(b); setSearchParams(b === 'Barchasi' ? {} : { brand: b }); }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedBrand === b
                ? 'bg-[#FF7900] text-white shadow-md shadow-orange-500/20'
                : 'bg-white dark:bg-[#18191D] text-[#555] dark:text-[#A1A1AA] border border-[#EAEAEA] dark:border-[#27282E] hover:border-neutral-300'
            }`}
          >
            {b === 'Barchasi' ? 'Barcha Brendlar' : b}
          </button>
        ))}
      </div>

      {/* Controls Bar: Storage & Price Range & Sort */}
      <div className="bg-white dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Storage Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#888888]">Xotira:</span>
          {['All', '128GB', '256GB', '512GB'].map(cap => (
            <button
              key={cap}
              onClick={() => setSelectedStorage(cap)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedStorage === cap
                  ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-[#666] hover:bg-neutral-200'
              }`}
            >
              {cap === 'All' ? 'Hammasi' : cap}
            </button>
          ))}
        </div>

        {/* Max Price Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#888888]">
            Narx: <strong className="text-[#171717] dark:text-white">{formatCurrency(maxPrice)} gacha</strong>
          </span>
          <input
            type="range"
            min="1500000"
            max="20000000"
            step="500000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 accent-[#FF7900] cursor-pointer"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#888888]">Saralash:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#27282E] rounded-xl px-3 py-1.5 text-xs font-bold text-[#171717] dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="popular">Eng ommabop</option>
            <option value="price_low">Narx: Arzondan qimmatga</option>
            <option value="price_high">Narx: Qimmatdan arzonga</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E]">
          <Smartphone className="w-12 h-12 text-[#888888] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#171717] dark:text-white">Hech qanday smartfon topilmadi</h3>
          <p className="text-xs text-[#888888] mt-1">Filtrlarni o'zgartirib qayta urinib ko'ring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(phone => {
            const installment = Math.round(Number(phone.sellingPrice) / 12);
            return (
              <div
                key={phone.id}
                className="group bg-white dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] rounded-3xl p-5 shadow-sm hover:shadow-card-hover transition flex flex-col justify-between"
              >
                {/* Brand & Stock */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#0284C7] bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md">
                    {phone.brand}
                  </span>
                  <span className="text-[10px] text-[#16A36A] font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Omborda bor ({phone.stock})
                  </span>
                </div>

                {/* Smartphone Photo */}
                <div
                  onClick={() => navigate(`/shop/product/${phone.id}`)}
                  className="w-full h-48 bg-[#FAFAFA] dark:bg-[#202127] rounded-2xl p-4 flex items-center justify-center my-2 cursor-pointer group-hover:scale-105 transition-transform"
                >
                  <img src={phone.image} alt={phone.name} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                </div>

                {/* Info */}
                <div className="space-y-2 pt-2">
                  <div>
                    <h3 
                      onClick={() => navigate(`/shop/product/${phone.id}`)}
                      className="font-bold text-sm text-[#171717] dark:text-white hover:text-[#FF7900] transition cursor-pointer truncate"
                    >
                      {phone.name}
                    </h3>
                    <p className="text-[11px] text-[#888888]">{phone.storage} • {phone.ram}</p>
                  </div>

                  <p className="text-[11px] text-[#666] dark:text-[#999] line-clamp-2">
                    {phone.description}
                  </p>

                  <div className="pt-2 border-t border-[#F0F0F0] dark:border-[#27282E]">
                    <span className="text-[10px] text-[#888888] font-semibold block">Narxi:</span>
                    <span className="font-extrabold text-base text-[#171717] dark:text-white">
                      {formatCurrency(phone.sellingPrice)}
                    </span>
                    <div className="text-[11px] text-[#FF7900] font-bold">
                      ~{formatCurrency(installment)} / oyiga
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => addToCart(phone)}
                      className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Savatga</span>
                    </button>
                    <button
                      onClick={() => navigate(`/shop/product/${phone.id}`)}
                      className="p-2.5 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#171717] dark:text-white transition cursor-pointer"
                      title="Batafsil ko'rish"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

