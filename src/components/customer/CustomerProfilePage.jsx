import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Package, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  ChevronLeft,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export default function CustomerProfilePage() {
  const { profile, updateProfile, orders } = useCustomer();

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    email: profile?.email || ''
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#888888] mb-6 font-medium">
        <NavLink to="/shop" className="hover:text-[#FF7900] transition flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Bosh Sahifa</span>
        </NavLink>
        <span>/</span>
        <span className="text-[#171717] dark:text-white font-bold">Mijoz Profili</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAEAEA] dark:border-[#27282E] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white">
            Mening Profilim
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Shaxsiy ma'lumotlaringiz va buyurtmalar yetkazilishi uchun asosiy manzilni boshqaring.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Profile Overview Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-6 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#171717] to-neutral-700 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-black/10 ring-4 ring-[#FF7900]/20 mb-4">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'MJ'}
            </div>
            <h2 className="text-lg font-black text-[#171717] dark:text-white">
              {profile?.name || 'Mijoz'}
            </h2>
            <p className="text-xs text-[#888888] mt-0.5">
              {profile?.phone || 'Telefon raqam ko\'rsatilmagan'}
            </p>

            <div className="mt-6 pt-6 border-t border-[#EAEAEA] dark:border-[#27282E] grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 dark:bg-[#202127] p-3 rounded-2xl">
                <span className="text-xs text-[#888888] font-medium block">Buyurtmalar</span>
                <span className="text-lg font-black text-[#FF7900]">{orders.length} ta</span>
              </div>
              <div className="bg-neutral-50 dark:bg-[#202127] p-3 rounded-2xl">
                <span className="text-xs text-[#888888] font-medium block">Mijoz Holati</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 inline-block">Tasdiqlangan</span>
              </div>
            </div>

            <div className="mt-6">
              <NavLink
                to="/shop/orders"
                className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#25262C] dark:hover:bg-[#2D2E35] text-[#171717] dark:text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4 text-[#FF7900]" />
                <span>Buyurtmalarim Tarixi</span>
              </NavLink>
            </div>
          </div>

          <div className="bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/30 rounded-3xl p-5 text-xs text-[#666] dark:text-[#A1A1AA] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#FF7900]">
              <Sparkles className="w-4 h-4" />
              <span>Maxsus Bonus Tizimi</span>
            </div>
            <p className="leading-relaxed">
              PhoneLytics do'konida xarid qilgan har bir smartfoningiz uchun keyingi xaridlarga 5% gacha keshbek va bepul aksessuarlar qo'shiladi!
            </p>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-[#171717] dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#FF7900]" />
              <span>Shaxsiy Ma'lumotlarni Tahrirlash</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-1.5">
                    To'liq Ism va Familiya *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Masalan: Jahongir Olimov"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
                    />
                    <User className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-1.5">
                    Telefon Raqami *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+998 90 123 45 67"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
                    />
                    <Phone className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-1.5">
                  Elektron Pochta (ixtiyoriy)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
                  />
                  <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#A1A1AA] mb-1.5">
                  Asosiy Yetkazib Berish Manzili *
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    required
                    rows="3"
                    placeholder="Toshkent shahri, Yunusobod tumani..."
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#FAFAFA] dark:bg-[#202127] border border-[#EAEAEA] dark:border-[#2E2F37] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder:text-[#888888] focus:bg-white dark:focus:bg-[#25262C] focus:outline-none focus:ring-1 focus:ring-[#FF7900]"
                  />
                  <MapPin className="w-4 h-4 text-[#888888] absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] dark:border-[#27282E] flex items-center justify-between">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  {isSaved && (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ma'lumotlar saqlandi!</span>
                    </>
                  )}
                </span>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-neutral-800 text-white font-bold text-xs tracking-wide transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4 text-[#FF7900]" />
                  <span>O'zgarishlarni Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
