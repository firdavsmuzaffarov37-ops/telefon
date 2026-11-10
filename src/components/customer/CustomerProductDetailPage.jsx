import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  Store, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  Share2, 
  Heart,
  Cpu,
  Smartphone,
  Camera,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCustomer } from '../../context/CustomerContext';
import { formatCurrency } from '../../utils/formatters';

export default function CustomerProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useApp();
  const { addToCart } = useCustomer();

  // Find target smartphone
  const product = useMemo(() => {
    return products.find(p => p.id === id) || products[0];
  }, [products, id]);

  const [selectedStorage, setSelectedStorage] = useState(product?.storage || '256GB');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [protectionPlan, setProtectionPlan] = useState('1-year');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Smartfon topilmadi</h2>
        <NavLink to="/shop/catalog" className="text-[#FF7900] underline mt-3 inline-block">
          Katalogga qaytish
        </NavLink>
      </div>
    );
  }

  const currentColor = product.colors?.[selectedColorIndex] || {
    name: product.color,
    hex: '#222',
    stock: product.stock
  };

  const monthlyInstallment = Math.round(Number(product.sellingPrice) / 12);

  const handleAddToCart = () => {
    addToCart(product, currentColor.name, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, currentColor.name, quantity);
    navigate('/shop/cart');
  };

  // Thumbnail angles (simulated for gallery)
  const thumbnails = [
    product.image,
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80"
  ];
  const [activeThumb, setActiveThumb] = useState(0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#888888] overflow-x-auto whitespace-nowrap">
        <NavLink to="/shop" className="hover:text-[#171717] dark:hover:text-white">Bosh sahifa</NavLink>
        <ChevronRight className="w-3.5 h-3.5" />
        <NavLink to="/shop/catalog" className="hover:text-[#171717] dark:hover:text-white">Smartfonlar</NavLink>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#171717] dark:text-white font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid (Matching Reference Image 2 Exactly!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 6 Columns: Large Product Photo, Genuine Stamp & Thumbnails */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative bg-white dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] rounded-3xl p-8 flex items-center justify-center min-h-[420px] sm:min-h-[480px] shadow-sm overflow-hidden">
            {/* GENUINE 100% ORIGINAL STAMP BADGE (Matching Image 2 blue starburst stamp) */}
            <div className="absolute top-5 left-5 z-10 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-[#0284C7] bg-sky-50/90 dark:bg-sky-950/80 text-[#0284C7] shadow-md rotate-[-8deg] pointer-events-none">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#0284C7]" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center leading-none mt-0.5">
                GENUINE<br />ORIGINAL
              </span>
            </div>

            {/* Top Right Wishlist & Share */}
            <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-500' 
                    : 'bg-white dark:bg-[#202127] border-[#EAEAEA] dark:border-[#2E2F37] text-[#888888] hover:text-[#171717]'
                }`}
                title="Sevimlilarga qo'shish"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Active Displayed Image */}
            <img
              src={thumbnails[activeThumb] || product.image}
              alt={product.name}
              className="max-h-80 sm:max-h-96 object-contain filter drop-shadow-2xl transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails Row (Matching Reference Image 2) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {thumbnails.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setActiveThumb(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 border bg-white dark:bg-[#18191D] transition flex items-center justify-center flex-shrink-0 cursor-pointer ${
                  activeThumb === idx
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                    : 'border-[#EAEAEA] dark:border-[#27282E] hover:border-neutral-300'
                }`}
              >
                <img src={thumb} alt="angle" className="max-h-full max-w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right 6 Columns: Product Purchase Configurator (Matching Reference Image 2) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block mb-1">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white leading-tight font-['Plus_Jakarta_Sans']">
              {product.name} {product.ram}+{selectedStorage}, {currentColor.name} Dual SIM, Original Box
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 mt-2 text-xs text-[#888888]">
              <div className="flex items-center gap-1 font-bold text-[#171717] dark:text-white">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>4.9</span>
                <span className="text-[#888888] font-normal">(2.6k baholar)</span>
              </div>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">100% Rasmiy Mahsulot</span>
            </div>
          </div>

          {/* Capacity Selection (Pills matching Image 2: 256GB, 512GB) */}
          <div>
            <label className="text-xs font-bold text-[#171717] dark:text-white block mb-2">
              Xotira Sig'imi (Capacity):
            </label>
            <div className="flex items-center gap-3">
              {['128GB', '256GB', '512GB'].map((cap) => {
                const isSelected = selectedStorage === cap;
                return (
                  <button
                    key={cap}
                    onClick={() => setSelectedStorage(cap)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center cursor-pointer ${
                      isSelected
                        ? 'border-[#0284C7] bg-sky-50/80 dark:bg-sky-950/40 text-[#0284C7] ring-1 ring-[#0284C7]'
                        : 'border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#18191D] text-[#171717] dark:text-white hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cap}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection (Circles & Name matching Image 2) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#171717] dark:text-white mb-2">
              <span>Rangi (Color):</span>
              <span className="text-[#0284C7]">{currentColor.name}</span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {(product.colors || [{ name: product.color, hex: '#222', stock: product.stock }]).map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    selectedColorIndex === idx
                      ? 'border-[#0284C7] ring-1 ring-[#0284C7] bg-sky-50/50 dark:bg-sky-950/30 text-[#171717] dark:text-white'
                      : 'border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#18191D] text-[#666666] hover:bg-neutral-50'
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0" 
                    style={{ backgroundColor: c.hex }} 
                  />
                  <span>{c.name}</span>
                  {selectedColorIndex === idx && <Check className="w-3.5 h-3.5 text-[#0284C7]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Installments Block (Matching Image 2 AED / So'm layout) */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-[#888888] font-semibold">Omabop Narxi:</span>
              <span className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white font-['Plus_Jakarta_Sans']">
                {formatCurrency(product.sellingPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#FF7900] font-bold">
              <span>Muddatli to'lov: oyiga ~{formatCurrency(monthlyInstallment)} dan</span>
              <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-[#FF7900] px-2 py-0.5 rounded-md">
                12 oyga 0%
              </span>
            </div>
          </div>

          {/* Big Action Buttons (Add to Cart matching Image 2 primary button) */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Savatga Qo'shish</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>1 Bosishda Sotib Olish</span>
            </button>
          </div>

          {/* Add Protection Plan (Matching Reference Image 2) */}
          <div className="p-4 bg-white dark:bg-[#18191D] rounded-2xl border border-[#EAEAEA] dark:border-[#27282E] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-[#171717] dark:text-white">Kafolat va Himoya Rejasi</span>
              </div>
              <span className="text-[10px] text-[#888888]">1 ta variant tanlanadi</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <label 
                onClick={() => setProtectionPlan('1-year')}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  protectionPlan === '1-year'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold'
                    : 'border-[#EAEAEA] dark:border-[#27282E]'
                }`}
              >
                <span>1 Yillik Rasmiy Kafolat</span>
                <span className="text-[10px] text-emerald-700 font-bold">BEPUL</span>
              </label>

              <label 
                onClick={() => setProtectionPlan('2-year')}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  protectionPlan === '2-year'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold'
                    : 'border-[#EAEAEA] dark:border-[#27282E]'
                }`}
              >
                <span>2 Yillik Kengaytirilgan</span>
                <span className="text-[10px] text-[#888888]">+450 000 so'm</span>
              </label>
            </div>
          </div>

          {/* How you'll get this item (Matching Reference Image 2 Delivery Card) */}
          <div className="p-4 bg-white dark:bg-[#18191D] rounded-2xl border border-[#EAEAEA] dark:border-[#27282E] space-y-2.5 text-xs">
            <h4 className="font-bold text-[#171717] dark:text-white">Yetkazib berish shartlari:</h4>

            <div className="flex items-center justify-between py-1 border-b border-[#F0F0F0] dark:border-[#27282E]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0284C7]" />
                <span className="text-[#666666] dark:text-[#999]">Kuryer orqali yetkazish:</span>
              </div>
              <span className="font-bold text-emerald-600">BEPUL (24 soatda)</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#F0F0F0] dark:border-[#27282E]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#FF7900]" />
                <span className="text-[#666666] dark:text-[#999]">Do'kondan olib ketish:</span>
              </div>
              <span className="font-bold text-[#171717] dark:text-white">Bugun mavjud</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span className="text-[#666666] dark:text-[#999]">Almashtirish kafolati:</span>
              </div>
              <span className="font-bold text-[#171717] dark:text-white">14 kun ichida</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          SPECIFICATIONS GRID (Matching Reference Image 2 Bottom Cards)
          ======================================================== */}
      <section className="bg-white dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-[#171717] dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Specifications (Texnik Xususiyatlar)
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Zavod tomonidan tasdiqlangan to'liq parametrlar jadvali
          </p>
        </div>

        {/* 6 Box Grid matching Image 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#27282E] text-center">
            <span className="text-[10px] font-semibold text-[#888888] block uppercase">Service Provider</span>
            <span className="text-xs font-bold text-[#171717] dark:text-white mt-1 block">Unlocked (Dual SIM)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#27282E] text-center">
            <span className="text-[10px] font-semibold text-[#888888] block uppercase">CPU Model</span>
            <span className="text-xs font-bold text-[#171717] dark:text-white mt-1 block truncate" title={product.specs?.chipset}>
              {product.specs?.chipset?.split(' ')[0] || 'Flagship 3nm'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#27282E] text-center">
            <span className="text-[10px] font-semibold text-[#888888] block uppercase">Front Cam mpx</span>
            <span className="text-xs font-bold text-[#171717] dark:text-white mt-1 block">12 MP TrueDepth</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#27282E] text-center">
            <span className="text-[10px] font-semibold text-[#888888] block uppercase">Ram Memory</span>
            <span className="text-xs font-bold text-[#171717] dark:text-white mt-1 block">{product.ram}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#27282E] text-center">
            <span className="text-[10px] font-semibold text-[#888888] block uppercase">Screen Size</span>
            <span className="text-xs font-bold text-[#171717] dark:text-white mt-1 block">{product.specs?.display?.split(' ')[0] || '6.7 inch'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#27282E] text-center">
            <span className="text-[10px] font-semibold text-[#888888] block uppercase">Battery</span>
            <span className="text-xs font-bold text-[#171717] dark:text-white mt-1 block">{product.specs?.battery?.split(' ')[0] || '5,000 mAh'}</span>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="pt-4 border-t border-[#EAEAEA] dark:border-[#27282E] text-xs leading-relaxed text-[#666666] dark:text-[#999] space-y-2">
          <h4 className="font-bold text-[#171717] dark:text-white text-sm">Mahsulot Tavsifi:</h4>
          <p>{product.description}</p>
        </div>
      </section>
    </div>
  );
}

