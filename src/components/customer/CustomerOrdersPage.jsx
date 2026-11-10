import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { formatUZS } from '../../utils/formatters';

export default function CustomerOrdersPage() {
  const { orders } = useCustomer();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-[#888888] mb-6 font-medium">
        <NavLink to="/shop" className="hover:text-[#FF7900] transition flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Bosh Sahifa</span>
        </NavLink>
        <span>/</span>
        <span className="text-[#171717] dark:text-white font-bold">Mening Buyurtmalarim</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAEAEA] dark:border-[#27282E] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white">
            Mening Buyurtmalarim
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Xarid qilingan smartfonlaringiz holatini onlayn kuzatib boring.
          </p>
        </div>
        <NavLink
          to="/shop/catalog"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171717] text-white text-xs font-bold hover:bg-neutral-800 transition"
        >
          <span>Katalogga o'tish</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF7900]" />
        </NavLink>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] mt-8 p-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-neutral-100 dark:bg-[#202127] flex items-center justify-center text-neutral-400 mb-4">
            <Package className="w-10 h-10 text-[#FF7900]" />
          </div>
          <h3 className="text-lg font-bold text-[#171717] dark:text-white mb-2">
            Hozircha buyurtmalar mavjud emas
          </h3>
          <p className="text-xs sm:text-sm text-[#888888] max-w-sm mx-auto mb-6">
            Katalogimizdan o'zingizga yoqqan smartfonni tanlang va birinchi buyurtmangizni bering.
          </p>
          <NavLink
            to="/shop/catalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF7900] text-white text-xs font-bold rounded-xl shadow-md transition hover:bg-[#E66D00]"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const isDelivered = order.status === 'Yetkazib berildi';
            const isShipping = order.status === 'Yetkazilmoqda';

            return (
              <div 
                key={order.id}
                className="bg-white dark:bg-[#18191D] rounded-3xl border border-[#EAEAEA] dark:border-[#27282E] p-5 sm:p-7 shadow-sm transition hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#EAEAEA] dark:border-[#27282E] gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base sm:text-lg font-black text-[#171717] dark:text-white tracking-tight">
                      Buyurtma #{order.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isDelivered
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : isShipping
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-orange-50 dark:bg-orange-950/50 text-[#FF7900] border border-orange-200 dark:border-orange-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isDelivered ? 'bg-emerald-500' : isShipping ? 'bg-blue-500 animate-pulse' : 'bg-[#FF7900]'
                      }`} />
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#888888]">
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#888888]" />
                      <span>{new Date(order.date).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline Stepper */}
                <div className="py-5 border-b border-[#EAEAEA] dark:border-[#27282E]">
                  <div className="grid grid-cols-3 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="hidden sm:inline">1. Qabul qilindi</span>
                    </div>

                    <div className={`flex items-center gap-2 ${
                      isShipping || isDelivered ? 'text-blue-600 dark:text-blue-400' : 'text-[#888888]'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isShipping || isDelivered ? 'bg-blue-100 dark:bg-blue-950' : 'bg-neutral-100 dark:bg-neutral-800'
                      }`}>
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <span className="hidden sm:inline">2. Kuryer yetkazmoqda</span>
                    </div>

                    <div className={`flex items-center gap-2 justify-end ${
                      isDelivered ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#888888]'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDelivered ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-neutral-100 dark:bg-neutral-800'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="hidden sm:inline">3. Yetkazib berildi</span>
                    </div>
                  </div>
                </div>

                {/* Items in order */}
                <div className="py-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-2.5 rounded-2xl bg-neutral-50 dark:bg-[#202127]/60">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#18191D] p-1 border border-black/5 dark:border-white/5 flex items-center justify-center flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#171717] dark:text-white">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-[#888888] mt-0.5">
                            {item.storage && <span>{item.storage}</span>}
                            <span>•</span>
                            <span className="text-[#FF7900] font-semibold">{item.color}</span>
                            <span>•</span>
                            <span>{item.quantity} dona</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-black text-[#171717] dark:text-white">
                          {formatUZS(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer: Recipient & Total */}
                <div className="pt-4 border-t border-[#EAEAEA] dark:border-[#27282E] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 text-[#666] dark:text-[#A1A1AA]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7900]" />
                      <span>Manzil: <strong>{order.customerAddress}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#FF7900]" />
                      <span>Telefon: <strong>{order.customerPhone}</strong> ({order.customerName})</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-0 border-dashed border-[#EAEAEA] dark:border-[#27282E]">
                    <span className="text-xs font-semibold text-[#888888]">Jami To'lov:</span>
                    <span className="text-lg font-black text-[#FF7900]">
                      {formatUZS(order.totalAmount)}
                    </span>
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
