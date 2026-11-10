import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Banknote, 
  CheckCircle2,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { formatUZS } from '../../utils/formatters';

export default function CustomerCartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    placeOrder, 
    profile 
  } = useCustomer();
  
  const navigate = useNavigate();

  // Checkout form fields
  const [formData, setFormData] = useState({
    customerName: profile?.name || '',
    customerPhone: profile?.phone || '',
    customerAddress: profile?.address || '',
    paymentMethod: 'Naqd (Yetkazilganda)'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.customerAddress.trim()) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        paymentMethod: formData.paymentMethod
      });
      setIsSubmitting(false);
      if (order) {
        navigate('/shop/orders');
      }
    }, 400);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-neutral-100 dark:bg-[#1E1F24] flex items-center justify-center text-neutral-400 mb-6">
          <ShoppingBag className="w-12 h-12 text-[#FF7900]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white mb-3">
          Savatchangiz hozircha bo'sh
        </h2>
        <p className="text-[#666] dark:text-[#A1A1AA] max-w-md mx-auto text-sm sm:text-base mb-8">
          Bizning rasmiy katalogimizdan eng so'nggi original flagman smartfonlarni tanlang va qulay xarid qiling.
        </p>
        <NavLink
          to="/shop/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-neutral-800 text-white rounded-2xl font-bold shadow-lg shadow-black/10 transition-all hover:scale-[1.02]"
        >
          <span>Smartfonlarni Ko'rish</span>
          <ArrowRight className="w-4 h-4 text-[#FF7900]" />
        </NavLink>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-[#888888] mb-6 font-medium">
        <NavLink to="/shop" className="hover:text-[#FF7900] transition flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Bosh Sahifa</span>
        </NavLink>
        <span>/</span>
        <span className="text-[#171717] dark:text-white font-bold">Savatcha & Rasmiylashtirish</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAEAEA] dark:border-[#27282E] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white">
            Xarid Savatchasi
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Tanlangan barcha smartfonlar rasmiy 1 yillik kafolat va bepul yetkazib berish bilan yuboriladi.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="self-start sm:self-auto text-xs font-semibold text-rose-500 hover:text-rose-600 transition flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Savatchani tozalash</span>
        </button>
      </div>

      {/* Main Grid: Cart Items & Checkout Form */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-4 sm:p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#171717] dark:text-white mb-4">
              Mahsulotlar ro'yxati ({cart.reduce((s, i) => s + i.quantity, 0)} dona)
            </h2>

            <div className="divide-y divide-[#EAEAEA] dark:divide-[#27282E]">
              {cart.map((item) => (
                <div key={`${item.id}-${item.color}`} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Thumbnail */}
                  <NavLink to={`/shop/product/${item.id}`} className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-[#25262C] p-2 flex-shrink-0 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain hover:scale-105 transition-transform" 
                    />
                  </NavLink>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <NavLink to={`/shop/product/${item.id}`} className="font-bold text-sm text-[#171717] dark:text-white hover:text-[#FF7900] transition truncate block">
                      {item.name}
                    </NavLink>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      {item.storage && (
                        <span className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-[#25262C] text-[#555] dark:text-[#A1A1AA] font-semibold text-[11px]">
                          {item.storage}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FF7900] font-semibold text-[11px] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                        {item.color}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        Omborda mavjud
                      </span>
                    </div>

                    <div className="mt-2 text-sm font-extrabold text-[#171717] dark:text-white">
                      {formatUZS(item.price)}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-dashed border-[#EAEAEA] dark:border-[#27282E]">
                    <div className="flex items-center border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl overflow-hidden bg-neutral-50 dark:bg-[#202127]">
                      <button
                        onClick={() => updateQuantity(item.id, item.color, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#171717] dark:text-white transition"
                        title="Kamaytirish"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-black text-[#171717] dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.color, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#171717] dark:text-white transition"
                        title="Ko'paytirish"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px] hidden sm:block">
                      <p className="text-xs text-[#888888] font-semibold">Umumiy:</p>
                      <p className="text-sm font-black text-[#FF7900]">
                        {formatUZS(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.color)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-[#18191D] p-3.5 rounded-2xl border border-[#EAEAEA] dark:border-[#27282E] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-[#FF7900] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] dark:text-white">100% Original</p>
                <p className="text-[11px] text-[#888888]">1 yillik rasmiy kafolat</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#18191D] p-3.5 rounded-2xl border border-[#EAEAEA] dark:border-[#27282E] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] dark:text-white">Tezkor Yetkazish</p>
                <p className="text-[11px] text-[#888888]">24 soatda bepul kuryer</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#18191D] p-3.5 rounded-2xl border border-[#EAEAEA] dark:border-[#27282E] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] dark:text-white">14 Kun Almashtirish</p>
                <p className="text-[11px] text-[#888888]">Qulay qaytarish imkoni</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Checkout & Delivery Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-6 shadow-xl shadow-black/5">
            <h2 className="text-lg font-black text-[#171717] dark:text-white pb-4 border-b border-[#EAEAEA] dark:border-[#27282E] flex items-center justify-between">
              <span>Buyurtmani Rasmiylashtirish</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Xavfsiz To'lov
              </span>
            </h2>

            <form onSubmit={handleSubmitOrder} className="mt-5 space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-1.5">
                  Ismingiz va Familiyangiz *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="Masalan: Sardor Rahimberdiyev"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-1.5">
                  Telefon Raqamingiz *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  placeholder="+998 90 123 45 67"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-1.5">
                  Yetkazib Berish Manzili *
                </label>
                <textarea
                  name="customerAddress"
                  required
                  rows="2"
                  placeholder="Shahar, tuman, ko'cha, uy raqami..."
                  value={formData.customerAddress}
                  onChange={handleChange}
                  className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-2">
                  To'lov Turi
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Naqd (Yetkazilganda)' }))}
                    className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition text-left cursor-pointer ${
                      formData.paymentMethod === 'Naqd (Yetkazilganda)'
                        ? 'border-[#FF7900] bg-orange-50/50 dark:bg-orange-950/20 text-[#171717] dark:text-white font-bold ring-1 ring-[#FF7900]'
                        : 'border-[#EAEAEA] dark:border-[#2E2F37] text-[#666] dark:text-[#A1A1AA] hover:bg-neutral-50 dark:hover:bg-[#202127]'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#FF7900]" />
                    <span>Naqd to'lov</span>
                    <span className="text-[10px] text-[#888888] font-normal">Kuryerga qo'lda</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Karta (Uzcard/Humo)' }))}
                    className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition text-left cursor-pointer ${
                      formData.paymentMethod === 'Karta (Uzcard/Humo)'
                        ? 'border-[#FF7900] bg-orange-50/50 dark:bg-orange-950/20 text-[#171717] dark:text-white font-bold ring-1 ring-[#FF7900]'
                        : 'border-[#EAEAEA] dark:border-[#2E2F37] text-[#666] dark:text-[#A1A1AA] hover:bg-neutral-50 dark:hover:bg-[#202127]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#FF7900]" />
                    <span>Bank Kartasi</span>
                    <span className="text-[10px] text-[#888888] font-normal">Humo / Uzcard</span>
                  </button>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="pt-4 border-t border-[#EAEAEA] dark:border-[#27282E] space-y-2 text-xs">
                <div className="flex justify-between text-[#666] dark:text-[#A1A1AA]">
                  <span>Mahsulotlar summasi:</span>
                  <span className="font-semibold text-[#171717] dark:text-white">{formatUZS(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#666] dark:text-[#A1A1AA]">
                  <span>Yetkazib berish (O'zbekiston):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Bepul (0 so'm)</span>
                </div>
                <div className="flex justify-between text-[#666] dark:text-[#A1A1AA]">
                  <span>Rasmiy 1 yillik kafolat:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Kiritilgan</span>
                </div>
                <div className="pt-3 border-t border-[#EAEAEA] dark:border-[#27282E] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#171717] dark:text-white">Jami to'lov:</span>
                  <span className="text-xl font-black text-[#FF7900]">{formatUZS(cartSubtotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 rounded-2xl bg-[#FF7900] hover:bg-[#E66D00] text-white font-black text-sm tracking-wide shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Rasmiylashtirilmoqda...</span>
                ) : (
                  <>
                    <span>Buyurtmani Tasdiqlash</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
