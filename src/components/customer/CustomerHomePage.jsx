import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Award, 
  Star, 
  Sparkles, 
  Smartphone, 
  ShoppingCart, 
  Eye, 
  Check,
  TrendingUp,
  Flame,
  BadgePercent
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCustomer } from '../../context/CustomerContext';
import { formatCurrency } from '../../utils/formatters';

export default function CustomerHomePage() {
  const { products } = useApp();
  const { addToCart } = useCustomer();
  const navigate = useNavigate();

  // Featured flagship phone for Hero Card (iPhone 16 Pro Max or S24 Ultra)
  const heroPhone = useMemo(() => {
    return products.find(p => p.id === 'prod-010') || products[0];
  }, [products]);

  // Categories / Brands
  const brandCategories = [
    { name: 'Apple iPhone', query: 'Apple', icon: '', count: '4 xil model', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80' },
    { name: 'Samsung Galaxy', query: 'Samsung', icon: 'S', count: '3 xil model', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Xiaomi & Redmi', query: 'Xiaomi', icon: 'Mi', count: '3 xil model', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80' },
    { name: 'Honor', query: 'Honor', icon: 'H', count: '1 xil model', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80' },
    { name: 'Google Pixel', query: 'Google', icon: 'G', count: '1 xil model', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80' }
  ];

  // Best-sellers & New arrivals
  const bestSellers = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const newArrivals = useMemo(() => {
    return products.slice(4, 8);
  }, [products]);

  return (
    <div className="space-y-16 pb-16">
      {/* ========================================================
          HERO SECTION (Matching Reference Image 1 Exactly!)
          ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-[#FAF8F5] to-[#F5F5F4] dark:from-[#15161A] dark:to-[#0E0F12] border-b border-[#EAEAEA] dark:border-[#27282E]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns: Text Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/70 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-[#FF7900] text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
                <span>LATEST DEALS OUT NOW</span>
              </div>

              {/* Big Headline (Serif + Sans elegance matching Image 1) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#171717] dark:text-white tracking-tight leading-[1.1] font-['Plus_Jakarta_Sans']">
                Experience Mobile <br />
                <span className="italic font-serif font-normal text-[#FF7900]">Excellence</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#666666] dark:text-[#A1A1AA] max-w-xl leading-relaxed">
                Elevate your digital life with PhoneLytics. Premium smartphones, official manufacturer warranty, and uncompromising retail service. Your journey to the future starts here.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3.5 pt-2 flex-wrap">
                <NavLink
                  to="/shop/catalog"
                  className="px-7 py-3.5 rounded-2xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2 transition"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </NavLink>

                <NavLink
                  to="/shop/catalog?brand=Apple"
                  className="px-6 py-3.5 rounded-2xl border-2 border-[#171717] dark:border-white text-[#171717] dark:text-white hover:bg-[#171717] hover:text-white dark:hover:bg-white dark:hover:text-[#171717] font-bold text-sm transition"
                >
                  BROWSE IPHONES
                </NavLink>
              </div>

              {/* Social Proof Stats Bar (10K+ Orders, 4.9/5 Rating, 24/7 Support) */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#EAEAEA] dark:border-[#27282E] max-w-lg">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white font-['Plus_Jakarta_Sans']">
                    10K+
                  </h4>
                  <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mt-0.5">
                    Orders Delivered
                  </p>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white font-['Plus_Jakarta_Sans']">
                    4.9/5
                  </h4>
                  <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mt-0.5">
                    Customer Rating
                  </p>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white font-['Plus_Jakarta_Sans']">
                    24/7
                  </h4>
                  <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mt-0.5">
                    Premium Support
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Hero Showcase Card with Floating Glass Badges */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-amber-50 to-orange-50/40 dark:from-[#1E1F24] dark:to-[#2A2B32] rounded-3xl p-8 border border-white/60 dark:border-white/10 shadow-2xl flex items-center justify-center">
                {/* Floating Badge 1 (Top-Right) */}
                <div className="absolute top-5 right-5 bg-white/90 dark:bg-[#18191D]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EAEAEA] dark:border-[#2A2B32] shadow-lg flex items-center gap-2.5 z-10 animate-in fade-in">
                  <div className="w-7 h-7 rounded-xl bg-orange-50 dark:bg-orange-500/20 text-[#FF7900] flex items-center justify-center">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#FF7900] uppercase tracking-wider block">New Arrival</span>
                    <span className="text-xs font-bold text-[#171717] dark:text-white">iPhone 16 Pro Max</span>
                  </div>
                </div>

                {/* Smartphone Hero Image */}
                <img
                  src={heroPhone.image}
                  alt={heroPhone.name}
                  className="max-h-72 sm:max-h-80 object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => navigate(`/shop/product/${heroPhone.id}`)}
                />

                {/* Floating Badge 2 (Bottom-Left) */}
                <div className="absolute bottom-5 left-5 bg-white/90 dark:bg-[#18191D]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EAEAEA] dark:border-[#2A2B32] shadow-lg flex items-center gap-2.5 z-10 animate-in fade-in">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#171717] dark:text-white block">Official Warranty</span>
                    <span className="text-[10px] text-[#888888]">1 Year Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BROWSE BY CATEGORY / BRENDLAR BO'YICHA
          ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#888888] mt-1">
              Find the perfect flagship smartphone or budget hero for your lifestyle.
            </p>
          </div>
          <NavLink
            to="/shop/catalog"
            className="text-xs font-bold text-[#FF7900] hover:underline flex items-center gap-1"
          >
            <span>Barchasini ko'rish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brandCategories.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/shop/catalog?brand=${encodeURIComponent(brand.query)}`)}
              className="group bg-white dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] rounded-3xl p-5 hover:border-[#FF7900] dark:hover:border-[#FF7900] shadow-sm hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full h-32 rounded-2xl bg-[#FAFAFA] dark:bg-[#202127] p-3 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                <img src={brand.image} alt={brand.name} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#171717] dark:text-white group-hover:text-[#FF7900] transition">
                  {brand.name}
                </h3>
                <span className="text-[11px] text-[#888888]">{brand.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          MASHHUR SMARTFONLAR (POPULAR PHONES)
          ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF7900] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-[#FF7900]" />
              <span>Eng Ko'p Sotilayotganlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Mashhur Flagmanlar
            </h2>
          </div>
          <NavLink
            to="/shop/catalog"
            className="text-xs font-bold text-[#FF7900] hover:underline flex items-center gap-1"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((phone) => {
            const installment = Math.round(Number(phone.sellingPrice) / 12);
            return (
              <div
                key={phone.id}
                className="group bg-white dark:bg-[#18191D] border border-[#EAEAEA] dark:border-[#27282E] rounded-3xl p-5 shadow-sm hover:shadow-card-hover transition flex flex-col justify-between"
              >
                {/* Badge & Rating */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-[#FF7900] border border-orange-200 dark:border-orange-500/20">
                    {phone.tag || 'Best Seller'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#171717] dark:text-white">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{phone.rating || '4.9'}</span>
                  </div>
                </div>

                {/* Product Image */}
                <div 
                  onClick={() => navigate(`/shop/product/${phone.id}`)}
                  className="w-full h-48 bg-[#FAFAFA] dark:bg-[#202127] rounded-2xl p-4 flex items-center justify-center my-2 cursor-pointer group-hover:scale-105 transition-transform"
                >
                  <img src={phone.image} alt={phone.name} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                </div>

                {/* Info & Price */}
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

                  {/* Highlights preview */}
                  <p className="text-[11px] text-[#666] dark:text-[#999] line-clamp-2">
                    {phone.description}
                  </p>

                  <div className="pt-2 border-t border-[#F0F0F0] dark:border-[#27282E]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#888888] font-semibold block">Narxi:</span>
                        <span className="font-extrabold text-base text-[#171717] dark:text-white">
                          {formatCurrency(phone.sellingPrice)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#16A36A] font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Omborda bor ({phone.stock})
                      </span>
                    </div>

                    <div className="mt-1 text-[11px] text-[#FF7900] font-bold">
                      ~{formatCurrency(installment)} / oyiga
                    </div>
                  </div>

                  {/* Add to cart / View buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => addToCart(phone)}
                      className="flex-1 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Savatga</span>
                    </button>
                    <button
                      onClick={() => navigate(`/shop/product/${phone.id}`)}
                      className="p-2 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#171717] dark:text-white transition cursor-pointer"
                      title="Batafsil"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          STORE VALUE PROPOSITION BANNER
          ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#171717] via-neutral-900 to-[#171717] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF7900]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[#FF7900] flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold mb-1">1 Yillik Rasmiy Kafolat</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Barcha smartfonlar zavod tomonidan original qadoqda beriladi va 12 oylik rasmiy kafolat bilan ta'minlanadi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[#FF7900] flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold mb-1">Bepul Tezkor Yetkazib Berish</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Toshkent shahri ichida 3 soatda, viloyatlar bo'ylab 24 soat ichida eshigingizgacha xavfsiz yetkazib beramiz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[#FF7900] flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold mb-1">100% Original Mahsulot</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  IMEI ro'yxatdan o'tgan, soxtalashtirilmagan haqiqiy original xalqaro flagman smartfonlar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

