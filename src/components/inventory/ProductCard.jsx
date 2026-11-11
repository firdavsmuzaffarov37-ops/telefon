import React, { useState } from 'react';
import { MoreVertical, Smartphone, ShoppingBag, Edit3, Trash2, Eye, ShieldCheck, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ 
  product, 
  isSelected, 
  onSelect,
  onEdit,
  onDelete
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isClientMode } = useApp();

  // Tag badge color styling
  let tagClass = "bg-orange-50 text-[#FF7900] border-orange-200/60";
  let tagText = t('tagNewArrival');

  if (product.tagType === 'popular' || product.tag === 'Popular') {
    tagClass = "bg-sky-50 text-[#0284C7] border-sky-200/60";
    tagText = t('tagPopular');
  } else if (product.tagType === 'best-seller' || product.tag === 'Best Seller') {
    tagClass = "bg-emerald-50 text-[#16A36A] border-emerald-200/60";
    tagText = t('tagBestSeller');
  }

  // Stock status text & color (5 tadan kam qolgan bo'lsa ogohlantirish berish)
  const currentStock = Number(product.stock) || 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  let stockText = `${t('inStockStatus')} (${currentStock} dona)`;
  let stockColor = "text-[#16A36A]";

  if (isOutOfStock) {
    stockText = "Tugagan (0 dona)";
    stockColor = "text-[#E5484D] font-bold";
  } else if (isLowStock) {
    stockText = `⚠️ Kam qoldi (${currentStock} dona)`;
    stockColor = "text-[#FF7900] dark:text-amber-400 font-extrabold";
  }

  const handleQuickSale = (e) => {
    e.stopPropagation();
    navigate(`/pos?product=${product.id}`);
  };

  // Unit profit calculation for staff
  const unitProfit = Number(product.sellingPrice) - Number(product.purchasePrice);
  // Monthly installment estimate for customers (12 months 0% or low fee)
  const monthlyInstallment = Math.round(Number(product.sellingPrice) / 12);

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col p-4 shadow-sm hover:shadow-card-hover ${
        isSelected
          ? 'border-[#FF7900] ring-2 ring-[#FF7900]/20'
          : 'border-[#EAEAEA] hover:border-neutral-300'
      }`}
    >
      {/* Top Card Header: Badge & 3-dot Menu */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tagClass}`}>
            {tagText}
          </span>
          {isClientMode ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              1 Yil Kafolat
            </span>
          ) : (
            <>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-[#555] border border-neutral-200">
                {product.brand}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-[#555] border border-neutral-200 flex items-center gap-1" title="Omborga kelib tushgan sana">
                <Calendar className="w-3 h-3 text-[#FF7900]" />
                <span>{product.arrivalDate || "08.11.2026"}</span>
              </span>
            </>
          )}
        </div>

        {/* 3-dot action button (hidden in client showcase mode) */}
        {!isClientMode && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg text-[#888888] hover:text-[#171717] hover:bg-neutral-100 flex items-center justify-center transition"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Popup Dropdown Menu */}
            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-[#EAEAEA] py-1.5 z-30 animate-in fade-in">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onSelect();
                    }}
                    className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#171717] hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#888888]" />
                    <span>{t('view')}</span>
                  </button>
                  <button
                    onClick={handleQuickSale}
                    className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#FF7900] hover:bg-orange-50 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('quickSellBtn')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(product);
                    }}
                    className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#171717] hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#888888]" />
                    <span>{t('editProductBtn')}</span>
                  </button>
                  <div className="border-t border-[#EAEAEA] my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(product.id);
                    }}
                    className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#E5484D] hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#E5484D]" />
                    <span>{t('deleteProductBtn')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Center Image Container */}
      <div className="relative w-full h-44 sm:h-48 my-1 flex items-center justify-center overflow-hidden rounded-xl bg-[#FAFAFA]/70 p-3 group-hover:bg-[#F7F7F6] transition-colors">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80";
          }}
        />
        
        {/* Quick sale button on hover for staff */}
        {!isClientMode && (
          <button
            onClick={handleQuickSale}
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#FF7900] text-white px-3 py-1.5 rounded-xl shadow-md hover:bg-[#EA6E00] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title={t('sellBtn')}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('sellBtn')}</span>
          </button>
        )}
      </div>

      {/* Product Details Bottom Block */}
      <div className="mt-auto pt-2 flex flex-col space-y-2">
        {/* Product Title */}
        <div>
          <h3 className="font-bold text-sm text-[#171717] leading-snug line-clamp-1 group-hover:text-[#FF7900] transition-colors font-['Plus_Jakarta_Sans']">
            {product.name}
          </h3>

          {/* Storage, RAM & SKU info */}
          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#888888]">
            <span className="font-semibold text-[#555555]">{product.storage} • {product.ram}</span>
            <span>•</span>
            <span className="truncate">{product.sku}</span>
          </div>
        </div>

        {/* TELEFON HAQIDA (Telefoni tagida yozilgan blok) */}
        <div className="bg-[#F9F9F8] rounded-xl p-2.5 border border-[#EFEFEF] space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#171717]">
            <Sparkles className="w-3 h-3 text-[#FF7900]" />
            <span>Telefon haqida:</span>
          </div>
          <p className="text-[11px] text-[#666666] leading-relaxed line-clamp-2">
            {product.description || "Original qadoqdagi rasmiy kafolatli smartfon. Barcha talablarga to'liq javob beradi."}
          </p>

          {/* Feature Highlights Pills */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              {product.highlights.slice(0, 3).map((item, idx) => (
                <span 
                  key={idx}
                  className="text-[9.5px] font-semibold bg-white text-[#444] px-1.5 py-0.5 rounded border border-[#E5E5E5] truncate"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RANGLAR VA HAR BIR RANG QOLDIG'I (Magazin va ishchilar uchun juda muhim) */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10.5px] font-semibold text-[#888888] mb-1">
            <span>Mavjud ranglar & qoldiq:</span>
            <span className="text-[#171717] font-bold">{product.stock} dona</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(product.colors || [{ name: product.color, hex: '#222', stock: product.stock }]).map((c, idx) => {
              const count = c.stock !== undefined ? c.stock : Math.ceil(product.stock / (product.colors?.length || 1));
              return (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-neutral-50 text-[#333] border border-neutral-200/80"
                  title={`${c.name}: ${count} dona mavjud`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0" 
                    style={{ backgroundColor: c.hex }} 
                  />
                  <span className="truncate max-w-[85px]">{c.name.split(' ')[0]}:</span>
                  <strong className={count > 0 ? "text-[#171717] font-bold" : "text-[#E5484D] font-bold"}>
                    {count > 0 ? `${count} ta` : "0"}
                  </strong>
                </span>
              );
            })}
          </div>
        </div>

        {/* Price and Stock row */}
        <div className="pt-2 border-t border-[#F0F0F0]">
          {isClientMode ? (
            /* MIJOZ / VITRINA REJIMI: Omabop narx va muddatli to'lov */
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#888888] font-semibold block">Omabop Narx:</span>
                <span className="font-extrabold text-base text-[#171717] font-['Plus_Jakarta_Sans']">
                  {formatCurrency(product.sellingPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#FF7900] font-bold block">Muddatli to'lov (12 oy):</span>
                <span className="text-xs font-bold text-[#171717]">
                  ~{formatCurrency(monthlyInstallment)} / oy
                </span>
              </div>
            </div>
          ) : (
            /* ISHCHI / DOKON REJIMI: Sotuv, Xarid Narxi, Sof Foyda va Avtomatik Qoldiq */
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#888888] font-bold block">Sotuv narxi:</span>
                  <span className="font-black text-sm text-[#171717]">
                    {formatCurrency(product.sellingPrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#888888] font-bold block">Ombordagi qoldiq:</span>
                  <span className={`text-xs font-black ${stockColor}`}>
                    {stockText}
                  </span>
                </div>
              </div>

              {/* 5 tadan kam qolgan telefonlar uchun maxsus ogohlantirish */}
              {isLowStock && (
                <div className="py-1 px-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-[11px] font-bold text-[#FF7900] dark:text-amber-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">⚠️</span>
                    <span>5 tadan kam qoldi ({currentStock} dona qolgan)!</span>
                  </div>
                  <span className="text-[10px] bg-orange-500/20 px-1.5 py-0.5 rounded-md font-extrabold">Ombor</span>
                </div>
              )}

              {isOutOfStock && (
                <div className="py-1 px-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-[11px] font-bold text-red-500 dark:text-red-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">⛔</span>
                    <span>Omborda tugagan (0 dona)!</span>
                  </div>
                  <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded-md font-extrabold">Zaxira</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-dashed border-[#EAEAEA] text-[10.5px]">
                <span className="text-[#666]">Xarid (Tan) narxi: <strong className="text-[#171717]">{formatCurrency(product.purchasePrice)}</strong></span>
                <span className="text-emerald-700 font-extrabold">Foyda: +{formatCurrency(unitProfit)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
