import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sparkles, 
  Flame, 
  Tag, 
  Clock, 
  ArrowRight, 
  ShoppingCart, 
  ShieldCheck, 
  ChevronLeft 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCustomer } from '../../context/CustomerContext';
import { formatUZS } from '../../utils/formatters';

export default function CustomerDealsPage() {
  const { products } = useApp();
  const { addToCart } = useCustomer();

  // Filter products that have discounts or popular flagships
  const deals = products.slice(0, 8);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#888888] mb-6 font-medium">
        <NavLink to="/shop" className="hover:text-[#FF7900] transition flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Bosh Sahifa</span>
        </NavLink>
        <span>/</span>
        <span className="text-[#171717] dark:text-white font-bold">Maxsus Chegirmalar & Aksiyalar</span>
      </div>

      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171717] via-neutral-900 to-[#2A1808] p-8 sm:p-12 text-white mb-10 shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7900] text-white text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-white animate-bounce" />
            Haftalik Maxsus Chegirmalar
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            15% gacha Chegirmalar & Bepul Sovg'alar
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
            Eng sara Apple, Samsung va Xiaomi modellarini maxsus narxlarda va 12 oylik foizsiz muddatli to'lov evaziga xarid qiling!
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold text-neutral-400">
            <Clock className="w-4 h-4 text-[#FF7900]" />
            <span>Aksiya tugashiga oz qoldi: <strong>3 kun 14 soat</strong></span>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 lg:opacity-30 pointer-events-none hidden md:block">
          <div className="w-96 h-96 rounded-full bg-[#FF7900] blur-[120px] absolute -right-20 -top-20" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((prod) => {
          const discountPct = 10;
          const originalPrice = Math.round(Number(prod.sellingPrice) * 1.12);

          return (
            <div
              key={prod.id}
              className="group bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-4 flex flex-col justify-between hover:shadow-xl hover:border-[#FF7900]/40 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-square rounded-2xl bg-[#FAFAFA] dark:bg-[#202127] p-4 flex items-center justify-center overflow-hidden mb-4">
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    -{discountPct}% Chegirma
                  </span>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                <div className="text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  {prod.brand} • {prod.storage}
                </div>
                <NavLink
                  to={`/shop/product/${prod.id}`}
                  className="font-bold text-sm text-[#171717] dark:text-white group-hover:text-[#FF7900] transition line-clamp-1 block mb-2"
                >
                  {prod.name}
                </NavLink>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-base font-black text-[#171717] dark:text-white">
                    {formatUZS(prod.sellingPrice)}
                  </span>
                  <span className="text-xs text-neutral-400 line-through">
                    {formatUZS(originalPrice)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAEAEA] dark:border-[#27282E]">
                  <NavLink
                    to={`/shop/product/${prod.id}`}
                    className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#25262C] dark:hover:bg-[#2F3038] text-[#171717] dark:text-white text-xs font-bold text-center transition"
                  >
                    Batafsil
                  </NavLink>

                  <button
                    onClick={() => addToCart(prod)}
                    className="py-2.5 px-3 rounded-xl bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-orange-500/20 transition cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Savatga</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
