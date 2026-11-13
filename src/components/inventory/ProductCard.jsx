import React, { useState } from 'react';
import { 
  Heart, 
  ArrowUpRight, 
  MoreVertical, 
  ShoppingBag, 
  Edit3, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  PackageCheck,
  Check
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ 
  product, 
  isSelected, 
  onSelect,
  onEdit,
  onDelete,
  onRestock,
  cardIndex = 0
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isClientMode } = useApp();

  const currentStock = Number(product.stock) || 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  // Strikethrough old market price (if not provided, default ~8% higher)
  const oldPrice = product.oldPrice || Math.round(Number(product.sellingPrice) * 1.08 / 10000) * 10000;

  // Alternating button style from reference screenshot (Orange gradient on some, dark on others)
  const isOrangeButton = cardIndex % 2 === 0;

  const handleQuickSale = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      onRestock && onRestock(product);
      return;
    }
    navigate(`/pos?product=${product.id}`);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-[#F5F5F7] dark:bg-[#181920] rounded-[28px] border transition-all duration-300 cursor-pointer flex flex-col justify-between p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 ${
        isSelected
          ? 'border-[#FF7900] ring-2 ring-[#FF7900]/30 shadow-lg bg-orange-50/20 dark:bg-orange-950/10'
          : 'border-[#EAEAEF] dark:border-[#272832] hover:border-[#FF7900]/50'
      }`}
    >
      {/* 1. Top Bar: Brand Badge & Interactive Heart Button (Directly from reference) */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#23242C] text-[#333333] dark:text-[#E2E2E6] border border-black/5 dark:border-white/5 shadow-xs">
            {product.brand}
          </span>
          {isOutOfStock ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 shadow-xs">
              Tugagan
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-900/60 shadow-xs">
              ⚠️ Kam qoldi: {currentStock} dona
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            className={`w-8 h-8 rounded-full bg-white dark:bg-[#23242C] shadow-sm flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer border border-black/5 dark:border-white/5 ${
              isLiked 
                ? 'text-[#FF7900]' 
                : 'text-[#999999] dark:text-[#77777F] hover:text-[#FF7900]'
            }`}
            title={isLiked ? "Saralanganlardan o'chirish" : "Saralanganlarga qo'shish"}
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-colors ${
                isLiked ? 'fill-[#FF7900] text-[#FF7900]' : ''
              }`} 
            />
          </button>

          {/* 3-dot Staff Menu */}
          {!isClientMode && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-white dark:bg-[#23242C] text-[#888888] hover:text-[#171717] dark:hover:text-white shadow-sm flex items-center justify-center transition hover:scale-105 border border-black/5 dark:border-white/5 cursor-pointer"
                title="Boshqaruv menyusi"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-9 w-48 bg-white dark:bg-[#1E1F26] rounded-2xl shadow-xl border border-[#EAEAEA] dark:border-[#2C2D36] py-1.5 z-30 animate-in fade-in">
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); onSelect(); }}
                      className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#171717] dark:text-white hover:bg-neutral-50 dark:hover:bg-[#272832] flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#888]" />
                      <span>{t('view')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onRestock && onRestock(product);
                      }}
                      className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zaxirani to'ldirish (+Restock)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); onEdit(product); }}
                      className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#171717] dark:text-white hover:bg-neutral-50 dark:hover:bg-[#272832] flex items-center gap-2 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#888]" />
                      <span>{t('editProductBtn')}</span>
                    </button>
                    <div className="border-t border-[#F0F0F0] dark:border-[#2A2B35] my-1" />
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); onDelete(product.id); }}
                      className="w-full px-3.5 py-1.5 text-xs text-left font-medium text-[#E5484D] hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
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
      </div>

      {/* 2. Center Phone Showcase: Sleek presentation floating on card */}
      <div className="relative w-full h-44 sm:h-52 my-3 flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80";
          }}
        />
      </div>

      {/* 3. Bottom Information & Circular Arrow Action Button (Matching Reference) */}
      <div className="pt-1 flex flex-col space-y-1.5">
        {/* Product Title */}
        <h3 className="font-bold text-[14px] sm:text-[15px] text-[#171717] dark:text-white truncate font-['Plus_Jakarta_Sans'] group-hover:text-[#FF7900] transition-colors">
          {product.name}
        </h3>

        {/* Price Row with Strikethrough Old Price + Signature Circular ↗ Button */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[#FF7900] font-black text-sm sm:text-base font-['Plus_Jakarta_Sans']">
              {formatCurrency(product.sellingPrice)}
            </span>
            <span className="text-[#9E9EA7] dark:text-[#7A7A84] line-through text-[11px] sm:text-xs font-semibold">
              {formatCurrency(oldPrice)}
            </span>
          </div>

          {/* Circular ↗ Arrow Button (In screenshot: vibrant orange gradient or black) */}
          <button
            type="button"
            onClick={handleQuickSale}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm cursor-pointer flex-shrink-0 ${
              isOutOfStock
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                : isOrangeButton
                  ? 'bg-gradient-to-tr from-[#FF7900] to-[#FFA03A] text-white shadow-orange-500/25'
                  : 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] hover:bg-[#333]'
            }`}
            title={isOutOfStock ? "Omborda tugagan (Zaxira to'ldirish)" : "POS da tezkor sotish"}
          >
            {isOutOfStock ? (
              <PackageCheck className="w-4 h-4 stroke-[2.2]" />
            ) : (
              <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
            )}
          </button>
        </div>

        {/* 4. Retail Shop Metadata: Storage, Available Colors and Stock Quantity */}
        <div className="pt-2 border-t border-[#EAEAEF] dark:border-[#262730] flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#666666] dark:text-[#A1A1AA] truncate max-w-[120px]">
            {product.storage} • {product.color?.split(' ')[0]}
          </span>

          <span className={`font-black ${
            isOutOfStock 
              ? 'text-red-500' 
              : isLowStock 
                ? 'text-[#FF7900] dark:text-amber-400 font-extrabold' 
                : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {isOutOfStock ? '⛔ Tugagan (0 dona)' : isLowStock ? `⚠️ ${currentStock} dona (5 tadan kam)` : `✓ ${currentStock} dona mavjud`}
          </span>
        </div>
      </div>
    </div>
  );
}
